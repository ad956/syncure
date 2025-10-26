const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/syncure';

async function listCollections() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    console.log(`Found ${collections.length} collections:`);
    
    for (const collection of collections) {
      console.log(`\n- ${collection.name}`);
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      console.log(`  Documents: ${count}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

listCollections();