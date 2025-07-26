// Simple script to update a user's role to ADMIN
const mongoose = require('mongoose');
const { MongoClient, ObjectId } = require('mongodb');

// Replace with your MongoDB connection string
const uri = 'mongodb://localhost:27017/portfolio';
const email = 'luis@luis.com';

async function makeAdmin() {
  let client;

  try {
    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db();
    const users = database.collection('users');
    
    // Find and update the user
    const result = await users.updateOne(
      { email: email },
      { $set: { role: 'admin' } }
    );
    
    if (result.matchedCount === 0) {
      console.log(`No user found with email: ${email}`);
    } else if (result.modifiedCount === 0) {
      console.log(`User ${email} was already an admin`);
    } else {
      console.log(`Successfully updated user ${email} to ADMIN role`);
    }
    
    // Show the updated user
    const user = await users.findOne({ email: email });
    console.log('User details:', user);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('Disconnected from MongoDB');
    }
  }
}

// Run the function
makeAdmin();
