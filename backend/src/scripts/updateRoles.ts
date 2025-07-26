import mongoose from 'mongoose';
import User, { UserRole } from '../models/User';
import config from '../config/config';

/**
 * Script to migrate existing users to the new role format
 * and make a specific user an admin by email
 */
async function migrateRoles() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    // Migrate all users with role 'ADMIN' to 'ADMIN'
    const adminResult = await User.updateMany(
      { role: 'ADMIN' },
      { $set: { role: UserRole.ADMIN } }
    );
    console.log(`Updated ${adminResult.modifiedCount} admin users`);

    // Migrate all users with role 'USER' to 'USER'
    const userResult = await User.updateMany(
      { role: 'user' },
      { $set: { role: UserRole.USER } }
    );
    console.log(`Updated ${userResult.modifiedCount} regular users`);

    // Migrate editor users if any exist
    const editorResult = await User.updateMany(
      { role: 'editor' },
      { $set: { role: UserRole.EDITOR } }
    );
    console.log(`Updated ${editorResult.modifiedCount} editor users`);

    // Make a specific user an admin by email (replace with your email)
    const adminEmail = process.argv[2] || 'your@email.com';
    const userToAdmin = await User.findOneAndUpdate(
      { email: adminEmail },
      { $set: { role: UserRole.ADMIN } },
      { new: true }
    );

    if (userToAdmin) {
      console.log(`User ${userToAdmin.name} (${userToAdmin.email}) is now an ${UserRole.ADMIN}`);
    } else {
      console.log(`No user found with email ${adminEmail}`);
    }

    console.log('Role migration completed successfully');
  } catch (error) {
    console.error('Error migrating roles:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
migrateRoles();
