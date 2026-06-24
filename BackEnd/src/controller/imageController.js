const imageModel = require('../models/image.model');
const categoryModel = require('../models/category.model');
const { cloudinary } = require('../middleware/uploadMiddleware');

const formatCategoryRef = (categoryRef) => {
  if (!categoryRef || !categoryRef._id) {
    return null;
  }

  return {
    _id: categoryRef._id,
    name: categoryRef.name || 'Deleted category',
  };
};

const formatImageResponse = (imageDoc) => {
  if (!imageDoc) {
    return null;
  }

  const plainImage = typeof imageDoc.toObject === 'function' ? imageDoc.toObject() : { ...imageDoc };
  const categoryRef = formatCategoryRef(plainImage.categoryId);

  return {
    ...plainImage,
    categoryId: categoryRef,
    categoryName: categoryRef?.name || 'Deleted category',
    categoryMissing: !categoryRef,
  };
};

const getActiveCategoryById = async (categoryId) =>
  categoryModel.findOne({ _id: categoryId, isActive: true }).select('_id name');

// Create Image (Single or Multiple)
exports.createImage = async (req, res) => {
  try {
    console.log('=== CREATE IMAGE REQUEST ===');
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    console.log('File:', req.file);
    
    const { categoryId, title, description } = req.body;

    if (!categoryId || !String(categoryId).trim()) {
      return res.status(400).json({ error: 'Category ID is required' });
    }

    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: 'Image title is required' });
    }

    // Check if category exists
    const category = await getActiveCategoryById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found or inactive' });
    }

    // Handle both single and multiple files
    const filesToProcess = req.files || (req.file ? [req.file] : []);
    
    if (!filesToProcess || filesToProcess.length === 0) {
      return res.status(400).json({ error: 'Image file(s) is required' });
    }

    const createdImages = [];

    // Process each file
    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
      
      console.log(`Processing file ${i + 1}:`, {
        secure_url: file.secure_url,
        path: file.path,
        public_id: file.public_id,
        filename: file.filename,
      });

      const imageUrl = file.secure_url || file.path;
      const publicId = file.public_id || file.filename;

      if (!imageUrl || !publicId) {
        console.error(`File ${i + 1} missing properties:`, file);
        continue;
      }

      const newImage = new imageModel({
        categoryId: String(categoryId).trim(),
        title: `${String(title).trim()}${filesToProcess.length > 1 ? ` ${i + 1}` : ''}`,
        description: description || '',
        imageUrl,
        publicId,
      });

      await newImage.save();
      const populatedImage = await imageModel.findById(newImage._id).populate('categoryId', 'name');
      createdImages.push(formatImageResponse(populatedImage));
      console.log(`Image ${i + 1} saved:`, newImage);
    }

    if (createdImages.length === 0) {
      return res.status(400).json({ error: 'Failed to process any images' });
    }

    res.status(201).json({
      message: `${createdImages.length} image(s) uploaded successfully`,
      images: createdImages,
    });
  } catch (error) {
    console.error('Create image error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
};

// Get All Images
exports.getAllImages = async (req, res) => {
  try {
    const images = await imageModel
      .find({ isActive: true })
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });

    const formattedImages = images.map(formatImageResponse);
    const orphanedCount = formattedImages.filter((image) => image.categoryMissing).length;

    res.status(200).json({
      message: 'Images fetched successfully',
      images: formattedImages,
      meta: {
        orphanedCount,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Images by Category
exports.getImagesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Check if category exists
    const category = await getActiveCategoryById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const images = await imageModel
      .find({ categoryId, isActive: true })
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Category images fetched successfully',
      images: images.map(formatImageResponse),
      categoryName: category.name,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Image by ID
exports.getImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await imageModel.findById(id).populate('categoryId', 'name');

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.status(200).json({
      message: 'Image fetched successfully',
      image: formatImageResponse(image),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Image
exports.updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, categoryId } = req.body;

    const image = await imageModel.findById(id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    if (typeof title === 'string') {
      const trimmedTitle = title.trim();
      if (!trimmedTitle) {
        return res.status(400).json({ error: 'Image title cannot be empty' });
      }

      image.title = trimmedTitle;
    }

    if (typeof description === 'string') {
      image.description = description;
    }

    if (typeof categoryId !== 'undefined') {
      const trimmedCategoryId = String(categoryId).trim();

      if (!trimmedCategoryId) {
        return res.status(400).json({ error: 'Category ID is required' });
      }

      const category = await getActiveCategoryById(trimmedCategoryId);
      if (!category) {
        return res.status(404).json({ error: 'Category not found or inactive' });
      }

      image.categoryId = trimmedCategoryId;
    }

    // Update image file if new one is uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      try {
        await cloudinary.uploader.destroy(image.publicId);
      } catch (err) {
        console.error('Error deleting old image:', err);
      }
      
      // Handle both secure_url and path property names from Cloudinary
      const imageUrl = req.file.secure_url || req.file.path;
      const publicId = req.file.public_id || req.file.filename;
      
      image.imageUrl = imageUrl;
      image.publicId = publicId;
    }

    await image.save();
    const updatedImage = await imageModel.findById(image._id).populate('categoryId', 'name');

    res.status(200).json({
      message: 'Image updated successfully',
      image: formatImageResponse(updatedImage),
    });
  } catch (error) {
    console.error('Update image error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
};

// Delete Image
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await imageModel.findById(id);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    await imageModel.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Image deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Soft delete (deactivate) Image
exports.deactivateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await imageModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.status(200).json({
      message: 'Image deactivated successfully',
      image,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
