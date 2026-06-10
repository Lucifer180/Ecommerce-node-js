const mongoose = require("mongoose");

let mongoServer;

const connectDb = async () => {
    try {
        let uri = process.env.MONGO_URI;

        if (process.env.NODE_ENV === "test") {
            const { MongoMemoryServer } = require("mongodb-memory-server");
            if (!mongoServer) {
                mongoServer = await MongoMemoryServer.create();
            }
            uri = mongoServer.getUri();
        }

        await mongoose.connect(uri, {
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
    if (mongoServer) {
        await mongoServer.stop();
    }
};

module.exports = connectDb;