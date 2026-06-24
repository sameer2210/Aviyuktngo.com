const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
    required: [true, 'Category ID is required'],
  },
  title: {
    type: String,
    required: [true, 'Image title is required'],
    trim: true,
    minlength: [2, 'Title must be at least 2 characters'],
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  publicId: {
    type: String,
    required: true, // For Cloudinary deletion
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const imageModel = mongoose.model('images', imageSchema);
module.exports = imageModel;
