import mongoose from 'mongoose';
import User from '../models/User';
import config from '../config/config';
import { UserRole } from '../models/User';

const makeAdmin = async (email: string) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');
    
    // Find the user and update role to admin
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }
    
    user.role = UserRole.ADMIN;
    await user.save();
    
    console.log(`User ${email} has been updated to admin role`);
    
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address');
  process.exit(1);
}

makeAdmin(email);
