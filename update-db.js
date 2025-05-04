require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./server/models/User');

async function updateDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Remove claudeAPIKey field from all users
    const result = await User.updateMany(
      {},
      { $unset: { claudeAPIKey: "" } }
    );

    console.log(`Updated ${result.modifiedCount} users`);
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateDatabase(); 