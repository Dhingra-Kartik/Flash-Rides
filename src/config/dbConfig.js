const mongoose = require('mongoose');

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('DATABASE CONNECTED');
    } catch (error) {
        console.error('DATABASE CONNECTION FAILED');
        console.error(error.message);

        process.exit(1);
    }
};

module.exports = connectDatabase;