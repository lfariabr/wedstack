// npx ts-node deleteGuests.ts

import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import Guest from '../src/models/Guest';
import { createClient } from 'redis';

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

        // Step 3 - Optionally clear Redis dedupe set used by import
        if (process.env.CLEAR_DEDUPE === '1') {
            const redisUrl = process.env.REDIS_URL || 'redis://localhost:6381';
            const redisClient = createClient({ url: redisUrl });
            await redisClient.connect();
            const mongoUriForKey = process.env.MONGODB_URI || 'mongodb://localhost:27018/wedstack';
            const seenSetKey = `wedstack:guest-import:seen:${Buffer.from(mongoUriForKey).toString('base64')}`;
            await redisClient.del(seenSetKey);
            console.log('Cleared Redis dedupe set due to CLEAR_DEDUPE=1:', seenSetKey);
            await redisClient.quit();
        }

        // Step 4 - Disconnect from MongoDB
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