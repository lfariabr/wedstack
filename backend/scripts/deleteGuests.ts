// npx ts-node deleteGuests.ts

import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import Guest from '../src/models/Guest';

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '../.env') });

async function connectToDatabase() {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27018/wedstack';
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB:', mongoUri);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

async function deleteAllGuests() {
    try {
        console.log('Starting guest deletion...');

        // Step 1 - Connect to MongoDB
        await connectToDatabase();

        // Step 2 - Delete all guests
        const result = await Guest.deleteMany({});
        console.log(`Deleted ${result.deletedCount} guests from collection.`);

        // Step 3 - Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');

        return { deleted: result.deletedCount };
    } catch (error) {
        console.error('Guest deletion failed:', error);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    deleteAllGuests()
        .then((result) => {
            console.log('Deletion completed successfully:', result);
            process.exit(0);
        })
        .catch((error) => {
            console.error('Deletion failed:', error);
            process.exit(1);
        });
}