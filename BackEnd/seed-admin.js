const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const Admin = require('./src/models/admin.model');

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin@aviyukt.org' });
    if (existingAdmin) {
      console.log('✅ Admin already exists:', existingAdmin.username);
      await mongoose.connection.close();
      return;
    }

    // Create admin
    const adminData = {
      username: process.env.ADMIN_USERNAME || 'admin@aviyukt.org',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      email: process.env.ADMIN_USERNAME || 'admin@aviyukt.org',
      role: 'admin',
      isActive: true,
    };

    const newAdmin = new Admin(adminData);
    await newAdmin.save();

    console.log('✅ Admin created successfully!');
    console.log(`Username: ${adminData.username}`);
    console.log(`Password: ${adminData.password}`);
    console.log(`Role: ${adminData.role}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
