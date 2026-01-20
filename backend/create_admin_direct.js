const mongoose = require('mongoose');

// Connect to MongoDB
async function createAdminUser() {
  try {
    await mongoose.connect('mongodb://localhost:27017/kisan-unnati', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const User = require('./src/models/User.model');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@kisanunnati.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@kisanunnati.com');
      console.log('Password: admin123');
      return;
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@kisanunnati.com',
      password: 'admin123', // Will be hashed by pre-save hook
      phone: '9999999999',
      role: 'admin',
      location: {
        address: 'Admin Office',
        district: 'Admin District',
        state: 'Admin State',
        pincode: '000000',
        coordinates: [0, 0]
      }
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@kisanunnati.com');
    console.log('Password: admin123');
    console.log('\nYou can now login to the admin panel at: http://localhost:3002/admin');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdminUser();