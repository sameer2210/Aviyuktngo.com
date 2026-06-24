const categoryModel = require('../models/category.model');
const imageModel = require('../models/image.model');
const { cloudinary } = require('../middleware/uploadMiddleware');

// Create Category
exports.createCategory = async (req, res) => {
  try {
    console.log('=== CREATE CATEGORY REQUEST ===');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    const { name, description } = req.body;

    // Check if category already exists
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const categoryData = {
      name,
      description: description || '',
    };

    // Add image if file is uploaded
    if (req.file) {
      console.log('File properties:', {
        secure_url: req.file.secure_url,
        path: req.file.path,
        public_id: req.file.public_id,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });
      
      const categoryImage = req.file.secure_url || req.file.path;
      const categoryImagePublicId = req.file.public_id || req.file.filename;
      
      console.log('Extracted values:', { categoryImage, categoryImagePublicId });
      
      if (!categoryImage || !categoryImagePublicId) {
        console.error('Cloudinary response missing properties:', req.file);
        return res.status(400).json({ 
          error: 'Image upload failed. Please try again.',
          debug: { hasSecureUrl: !!req.file.secure_url, hasPath: !!req.file.path, hasPublicId: !!req.file.public_id }
        });
      }
      
      categoryData.categoryImage = categoryImage;
      categoryData.categoryImagePublicId = categoryImagePublicId;
    } else {
      console.log('No file uploaded');
    }

    const newCategory = new categoryModel(categoryData);
    await newCategory.save();
    console.log('Category saved:', newCategory);

    res.status(201).json({
      message: 'Category created successfully',
      category: newCategory,
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get All Categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({
      message: 'Categories fetched successfully',
      categories,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById(id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({
      message: 'Category fetched successfully',
      category,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if name is being changed and if it already exists
    if (name && name !== category.name) {
      const existingCategory = await categoryModel.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ error: 'Category name already exists' });
      }
      category.name = name;
    }

    if (description) category.description = description;

    // Update image if new file is uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      if (category.categoryImagePublicId) {
        try {
          await cloudinary.uploader.destroy(category.categoryImagePublicId);
        } catch (err) {
          console.error('Error deleting old category image:', err);
        }
      }
      
      // Handle both secure_url and path property names from Cloudinary
      const categoryImage = req.file.secure_url || req.file.path;
      const categoryImagePublicId = req.file.public_id || req.file.filename;
      
      category.categoryImage = categoryImage;
      category.categoryImagePublicId = categoryImagePublicId;
    }

    await category.save();

    res.status(200).json({
      message: 'Category updated successfully',
      category,
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById(id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Delete image from Cloudinary
    if (category.categoryImagePublicId) {
      await cloudinary.uploader.destroy(category.categoryImagePublicId);
    }

    const linkedImages = await imageModel.find({ categoryId: id });
    await Promise.allSettled(
      linkedImages.map((image) =>
        image.publicId ? cloudinary.uploader.destroy(image.publicId) : Promise.resolve()
      )
    );
    const deletedImagesResult = await imageModel.deleteMany({ categoryId: id });

    await categoryModel.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Category deleted successfully',
      deletedImagesCount: deletedImagesResult.deletedCount || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Soft delete (deactivate) Category
exports.deactivateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({
      message: 'Category deactivated successfully',
      category,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
