const mongoose = require('mongoose');
require('dotenv').config();

const Admin = require('./src/models/admin.model');

async function seedAdminCredentials() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Admin credentials to seed
    const adminData = {
      username: 'admin@aviyukt.org',
      password: 'admin123',
      email: 'admin@aviyukt.org',
      role: 'admin',
    };

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: adminData.username.toLowerCase() });
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', adminData.username);
      console.log('📧 Email:', existingAdmin.email);
      console.log('🔐 Password:', existingAdmin.password);
      await mongoose.disconnect();
      return;
    }

    // Create new admin
    const newAdmin = new Admin(adminData);
    await newAdmin.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Username:', adminData.username);
    console.log('🔑 Password:', adminData.password);
    console.log('📬 Email:', adminData.email);
    console.log('\n🌐 Admin Panel Login:');
    console.log('URL: http://localhost:5173/admin-login');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
}

seedAdminCredentials();
