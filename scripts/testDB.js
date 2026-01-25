const mongoose = require('mongoose');

async function testConnection() {
    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect('mongodb://localhost:27017/test_connection', {
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ SUCCESS: Connected to MongoDB successfully!');
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ ERROR: Could not connect to MongoDB.');
        console.error('Error details:', err.message);
        process.exit(1);
    }
}

testConnection();
