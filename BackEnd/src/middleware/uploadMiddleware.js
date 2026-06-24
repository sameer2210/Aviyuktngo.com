const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for category images
const categoryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'aviyukt_categories',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    resource_type: 'auto',
  },
});

// Storage for gallery images
const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'aviyukt_gallery',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    resource_type: 'auto',
  },
});

const uploadCategory = multer({
  storage: categoryStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const uploadGallery = multer({
  storage: galleryStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

module.exports = {
  cloudinary,
  uploadCategory,
  uploadGallery,
};
