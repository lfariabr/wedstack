import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Singleton instance of MongoDB Memory Server
let mongoServer: MongoMemoryServer;

/**
 * Connect to the in-memory database.
 */
export const connect = async (): Promise<void> => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  await mongoose.connect(uri);
};

/**
 * Drop database, close the connection and stop mongod.
 */
export const closeDatabase = async (): Promise<void> => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

/**
 * Remove all the data for all db collections.
 */
export const clearDatabase = async (): Promise<void> => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

// Add a dummy test to avoid Jest's "no tests" error
describe('Database Handler', () => {
  it('should define connection methods', () => {
    expect(typeof connect).toBe('function');
    expect(typeof clearDatabase).toBe('function');
    expect(typeof closeDatabase).toBe('function');
  });
});
