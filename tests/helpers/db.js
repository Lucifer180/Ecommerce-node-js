const mongoose = require("mongoose");
const connectDb = require("../../src/config/db");
const redis = require("../../src/config/queue");

const connect = async () => {
    if (mongoose.connection.readyState === 0) {
        await connectDb();
    }
};

const disconnect = async () => {
    await connectDb.disconnectDb();

    if (redis?.quit) {
        await redis.quit();
    }
};

/** Wipes every collection so each suite starts from a known-empty database. */
const clear = async () => {
    const { collections } = mongoose.connection;

    await Promise.all(
        Object.values(collections).map((collection) => collection.deleteMany({}))
    );

    // The product list endpoint caches in Redis; stale keys would mask writes.
    if (redis?.flushall) {
        await redis.flushall();
    }
};

module.exports = { connect, disconnect, clear };
