const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const imageModel = require('../src/models/image.model');
const { cloudinary } = require('../src/middleware/uploadMiddleware');

const cleanupOrphanedGalleryImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const images = await imageModel.find({}).populate('categoryId', '_id').sort({ createdAt: -1 });
    const orphanedImages = images.filter((image) => !image.categoryId);

    if (orphanedImages.length === 0) {
      console.log('No orphaned gallery images found.');
      await mongoose.connection.close();
      return;
    }

    console.log(`Found ${orphanedImages.length} orphaned image(s). Cleaning up...`);

    await Promise.allSettled(
      orphanedImages.map((image) =>
        image.publicId ? cloudinary.uploader.destroy(image.publicId) : Promise.resolve()
      )
    );

    const deleteResult = await imageModel.deleteMany({
      _id: { $in: orphanedImages.map((image) => image._id) },
    });

    console.log(`Deleted ${deleteResult.deletedCount || 0} orphaned image document(s).`);
    await mongoose.connection.close();
  } catch (error) {
    console.error('Cleanup failed:', error.message);
    process.exitCode = 1;

    try {
      await mongoose.connection.close();
    } catch (closeError) {
      console.error('Failed to close MongoDB connection:', closeError.message);
    }
  }
};

cleanupOrphanedGalleryImages();
