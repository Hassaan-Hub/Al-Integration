// Database connection logic using Mongoose and MongoDB Atlas
import mongoose from 'mongoose';

const getSafeDiagnostic = (error) => {
  const diagnostic = {};

  if (typeof error?.name === 'string' && /^[A-Za-z][A-Za-z0-9]*$/.test(error.name)) {
    diagnostic.name = error.name;
  }

  if (
    (typeof error?.code === 'string' && /^[A-Z0-9_]+$/.test(error.code)) ||
    (typeof error?.code === 'number' && Number.isFinite(error.code))
  ) {
    diagnostic.code = error.code;
  }

  return diagnostic;
};

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB', getSafeDiagnostic(error));
    process.exit(1);
  }
};

export default connectDB;