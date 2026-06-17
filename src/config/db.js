const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: 20
        });
        if (process.env.NODE_ENV !== "test") {
            console.log("mongoDb connected");
        }
    } catch (err) {
        console.error("MongoDB connection error:", err);
        if (process.env.NODE_ENV === 'test') {
            throw err;
        }
        process.exit(1)
    }
}

connectDb.disconnectDb = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
    }
};

module.exports = connectDb;