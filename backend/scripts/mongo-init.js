// This script creates the portfolio database and initializes collections
db = db.getSiblingDB('portfolio');

// Create collections - MongoDB will create them automatically when documents are inserted,
// but explicitly creating them is a good practice
db.createCollection('users');
db.createCollection('chats');
db.createCollection('messages');

// Create a database user for the application (optional - can also use root credentials)
// This creates a user specific to the portfolio database with readWrite permissions
db.createUser({
  user: process.env.MONGO_USER || 'ADMIN',
  pwd: process.env.MONGO_PASSWORD || 'secure_password_here',
  roles: [
    { role: 'readWrite', db: 'portfolio' }
  ]
});

// You can insert initial data here if needed
// Example: Creating an admin user
db.users.insertOne({
  name: 'Admin User',
  email: 'admin@example.com',
  password: '$2b$10$X/A.CDLyPJBxPwLxpkGpkOGe9hLCO4wt36i/m.8n9GRXGQFwDJRy.', // hashed password: 'adminPassword123!'
  role: 'ADMIN',
  createdAt: new Date()
});

print('MongoDB initialization completed successfully');
