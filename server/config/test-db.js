require('dotenv').config();
const connectDB = require('./db');

// Test database connection
console.log('Testing Database Configuration...');

// Connect to database
connectDB()
  .then(() => {
    console.log('✅ Database configuration test successful!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database configuration test failed!');
    console.error(error);
    process.exit(1);
  }); 