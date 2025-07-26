require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function resetPassword() {
  try {
    // Connect to your database
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Get the database connection
    const db = mongoose.connection.db;
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('XXXXXXXX', salt);
    
    // Update the user directly in the database
    const result = await db.collection('users').updateOne(
      { email: 'xx@xx.com' },
      { $set: { password: hashedPassword } }
    );
    
    if (result.matchedCount === 0) {
      console.error('User not found');
      process.exit(1);
    }
    
    console.log('Password updated successfully!');
    console.log('Updated', result.modifiedCount, 'user(s)');
    process.exit(0);
  } catch (error) {
    console.error('Error updating password:', error);
    process.exit(1);
  }
}

resetPassword();