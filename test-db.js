const mongoose = require('mongoose');
const Upload = require('./src/modules/uploads/upload.model');
require('dotenv').config();

async function run() {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce");
    console.log("Connected to MongoDB");
    const uploadId = "6a7aee80022b48b7f8fe49ca";
    const upload = await Upload.findById(uploadId);
    console.log("Found:", upload);
    process.exit(0);
}

run().catch(console.error);
