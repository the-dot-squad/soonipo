import mongoose from 'mongoose';

let isConnected = false; // Track the connection status

export default async function connectDB() {
  if (isConnected) {
    // Already connected
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log('MongoDB connected successfully.');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    throw err;
  }
}