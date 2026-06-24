const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController');
const imageController = require('../controller/imageController');
const authMiddleware = require('../middleware/authMiddleware');
const { uploadCategory, uploadGallery } = require('../middleware/uploadMiddleware');

// Category Routes
router.post(
  '/categories',
  authMiddleware.isAdmin,
  uploadCategory.single('categoryImage'),
  categoryController.createCategory
);

router.get('/categories', categoryController.getAllCategories);

router.get('/categories/:id', categoryController.getCategoryById);

router.put(
  '/categories/:id',
  authMiddleware.isAdmin,
  uploadCategory.single('categoryImage'),
  categoryController.updateCategory
);

router.delete(
  '/categories/:id',
  authMiddleware.isAdmin,
  categoryController.deleteCategory
);

router.patch(
  '/categories/:id/deactivate',
  authMiddleware.isAdmin,
  categoryController.deactivateCategory
);

// Image Routes
router.post(
  '/images',
  authMiddleware.isAdmin,
  uploadGallery.array('image', 10), // Allow up to 10 images at once
  imageController.createImage
);

router.get('/images', imageController.getAllImages);

router.get('/images/category/:categoryId', imageController.getImagesByCategory);

router.get('/images/:id', imageController.getImageById);

router.put(
  '/images/:id',
  authMiddleware.isAdmin,
  uploadGallery.single('image'),
  imageController.updateImage
);

router.delete(
  '/images/:id',
  authMiddleware.isAdmin,
  imageController.deleteImage
);

router.patch(
  '/images/:id/deactivate',
  authMiddleware.isAdmin,
  imageController.deactivateImage
);

module.exports = router;
