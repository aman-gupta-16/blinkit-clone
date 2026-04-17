require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const existing = await User.findOne({ email: 'admin@blinkit.com' });
  if (existing) {
    console.log('⚠️  Admin user already exists:', existing.email);
    process.exit(0);
  }

  const admin = await User.create({
    name: 'Blinkit Admin',
    email: 'admin@blinkit.com',
    password: 'admin123',
    role: 'admin',
  });

  console.log('🎉 Admin user created successfully!');
  console.log('   Email:   ', admin.email);
  console.log('   Password: admin123');
  console.log('   Role:    ', admin.role);
  process.exit(0);
};

createAdmin().catch((err) => {
  console.error('❌ Error creating admin:', err.message);
  process.exit(1);
});
