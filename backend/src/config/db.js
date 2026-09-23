const mongoose = require('mongoose');

async function connectDB() {
  try {
    // If MONGO_URI has no /<dbName> path segment, the driver would otherwise
    // default to a database called "test". DB_NAME makes the target explicit.
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME
    });
    console.log(`MongoDB connected (db: ${mongoose.connection.name})`);
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;