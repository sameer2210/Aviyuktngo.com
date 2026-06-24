const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Category name must be at least 3 characters'],
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  categoryImage: {
    type: String,
    default: null, // Single image for category
  },
  categoryImagePublicId: {
    type: String,
    default: null, // For Cloudinary deletion
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const categoryModel = mongoose.model('categories', categorySchema);
module.exports = categoryModel;
