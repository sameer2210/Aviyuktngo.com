const mongoose = require('mongoose');
const categoryModel = require('./category.model');

const imageSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
    required: [true, 'Category ID is required'],
    index: true,
    validate: {
      validator: async function (value) {
        if (!value) {
          return false;
        }

        const categoryExists = await categoryModel.exists({ _id: value });
        return !!categoryExists;
      },
      message: 'Category does not exist',
    },
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
