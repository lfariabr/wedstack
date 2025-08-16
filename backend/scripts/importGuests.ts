// npx ts-node importGuests.ts

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '../.env') });

import { createClient } from 'redis';
import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';
import { parse } from 'csv-parse';
import mongoose from 'mongoose';
import Guest, { iGuest } from '../src/models/Guest';

// Direct MongoDB connection without config dependency
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

function normalizeRow(r: Record<string, string>): Partial<iGuest> {
    const clean = (s?: string) => {
        const result = (s ?? '').trim();
        return result;
    };
    
    // Debug logging to see what's happening
    console.log('Raw input to normalizeRow:', r);
    console.log('Object keys:', Object.keys(r));
    
    // Handle BOM and quoted property names by finding keys that contain the field names
    const nameKey = Object.keys(r).find(key => key.includes('name')) || 'name';
    const nameValue = r[nameKey];
    
    console.log('Name key found:', nameKey, 'Name value:', nameValue, 'type:', typeof nameValue);
    
    const cleanedName = clean(nameValue);
    console.log('Cleaned name:', cleanedName, 'length:', cleanedName.length);
    
    return {
        name: cleanedName,
        phone: clean(r.phone) || undefined,
        group: clean(r.group) || undefined,
        status: clean(r.status) || undefined,
        plusOnes: Number(clean(r.plusOnes) || '0'),
    };
}

async function importGuests() {
    try {
        console.log('Starting guest import...');
        
        // Step 1 - Connect to MongoDB directly
        await connectToDatabase();
        
        // Step 2 - Connect to Redis
        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6381';
        const redisClient = createClient({ url: redisUrl });
        await redisClient.connect();
        console.log('Connected to Redis:', redisUrl);

        // Build a dedupe set key namespaced by the MongoDB URI to avoid cross-env collisions
        const mongoUriForKey = process.env.MONGODB_URI || 'mongodb://localhost:27018/wedstack';
        const seenSetKey = `wedstack:guest-import:seen:${Buffer.from(mongoUriForKey).toString('base64')}`; // store dedupe keys (phone)
        console.log('Using dedupe set key:', seenSetKey);

        // Optionally clear dedupe set if requested
        if (process.env.RESET_DEDUPE === '1') {
            await redisClient.del(seenSetKey);
            console.log('Cleared Redis dedupe set due to RESET_DEDUPE=1');
        }

        // Step 3 - CSV stream
        const csvFilePath = path.join(__dirname, 'wedstack_guestlist_v3.csv');
        const csvStream = createReadStream(csvFilePath);
        
        let total = 0;
        let inserted = 0;
        let updated = 0;
        let skipped = 0;
        const errors: Array<{ line: number; error: string }> = [];

        // Step 4 - Building pipeline
        await pipeline(
            csvStream,
            parse({
                columns: true,
                skip_empty_lines: true,
                delimiter: ',',
                trim: true,
                skip_records_with_error: false,
            }),
            async function* (source) {
                let line = 1; // data lines excluding header
                for await (const raw of source as AsyncIterableIterator<any>) {
                    total += 1;
                    
                    // Debug logging to see what we're getting
                    console.log(`Line ${line} raw data:`, JSON.stringify(raw));
                    
                    try {
                        const row = normalizeRow(raw);
                        console.log(`Line ${line} normalized:`, JSON.stringify(row));

                        // Basic validation
                        if (!row.name || row.name.trim() === '') {
                            errors.push({ line, error: `Missing name. Raw data: ${JSON.stringify(raw)}` });
                            skipped += 1;
                            line += 1;
                            continue;
                        }

                        if (!row.phone || row.phone.trim() === '') {
                            errors.push({ line, error: `Missing phone (required for deduplication). Raw data: ${JSON.stringify(raw)}` });
                            skipped += 1;
                            line += 1;
                            continue;
                        }

                        // Pick an idempotent key
                        const dedupeKey = row.phone;
                        console.log('Using dedupe key:', dedupeKey);
                        const seen = await redisClient.sIsMember(seenSetKey, dedupeKey);
                        if (seen) {
                            console.log(`Skipping duplicate phone: ${dedupeKey}`);
                            skipped += 1;
                            line += 1;
                            continue;
                        }
                        await redisClient.sAdd(seenSetKey, dedupeKey);
                        
                        // Upsert filter
                        const filter = { phone: row.phone };

                        const update = {
                            $set: {
                                name: row.name,
                                phone: row.phone,
                                group: row.group || 'general',
                                status: row.status || 'pending',
                                plusOnes: row.plusOnes || 0,
                            },
                        };

                        const res = await Guest.updateOne(filter, update, { upsert: true });
                        
                        if (res.matchedCount === 0) {
                            inserted += 1;
                            console.log(`Inserted new guest: ${row.name}`);
                        } else if (res.modifiedCount > 0) {
                            updated += 1;
                            console.log(`Updated existing guest: ${row.name}`);
                        }
                    } catch (err: any) {
                        skipped += 1;
                        errors.push({ line, error: err.message || String(err) });
                        console.error(`Error processing line ${line}:`, err.message);
                    } finally {
                        line += 1;
                    }
                } 
            }
        );
        
        // Step 5 - Close connections
        await redisClient.quit();
        console.log('Disconnected from Redis');
        
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');

        // Step 6 - Report
        console.log('--- Import complete ---');
        console.log({ total, inserted, updated, skipped });
        if (errors.length) {
            console.log('Errors (first 10):', errors.slice(0, 10));
        }
        
        return { total, inserted, updated, skipped, errors };
    } catch (error) {
        console.error('Import failed:', error);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    importGuests()
        .then((result) => {
            console.log('Import completed successfully:', result);
            process.exit(0);
        })
        .catch((error) => {
            console.error('Import failed:', error);
            process.exit(1);
        });
}