const imageModel = require('../models/image.model');
const categoryModel = require('../models/category.model');
const { cloudinary } = require('../middleware/uploadMiddleware');

// Create Image (Single or Multiple)
exports.createImage = async (req, res) => {
  try {
    console.log('=== CREATE IMAGE REQUEST ===');
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    console.log('File:', req.file);
    
    const { categoryId, title, description } = req.body;

    // Check if category exists
    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
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
        categoryId,
        title: `${title}${filesToProcess.length > 1 ? ` ${i + 1}` : ''}`,
        description: description || '',
        imageUrl,
        publicId,
      });

      await newImage.save();
      createdImages.push(newImage);
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

    res.status(200).json({
      message: 'Images fetched successfully',
      images,
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
    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const images = await imageModel
      .find({ categoryId, isActive: true })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Category images fetched successfully',
      images,
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
      image,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Image
exports.updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const image = await imageModel.findById(id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    if (title) image.title = title;
    if (description) image.description = description;

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

    res.status(200).json({
      message: 'Image updated successfully',
      image,
    });
  } catch (error) {
    console.error('Update image error:', error);
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
