const mongoose = require('mongoose');

async function cleanupIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/kisan-unnati', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Get the users collection
    const usersCollection = mongoose.connection.db.collection('users');

    // Get current indexes
    const indexes = await usersCollection.indexes();
    console.log('Current indexes on users collection:', indexes);

    // Try to drop geospatial index if it exists
    try {
      await usersCollection.dropIndex({ location: '2dsphere' });
      console.log('Successfully dropped geospatial index on users.location');
    } catch (error) {
      console.log('No geospatial index found on users.location:', error.message);
    }

    // Check products collection too
    const productsCollection = mongoose.connection.db.collection('products');
    try {
      await productsCollection.dropIndex({ location: '2dsphere' });
      console.log('Successfully dropped geospatial index on products.location');
    } catch (error) {
      console.log('No geospatial index found on products.location:', error.message);
    }

    // Get indexes after cleanup
    const indexesAfter = await usersCollection.indexes();
    console.log('Indexes after cleanup:', indexesAfter);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

cleanupIndexes();