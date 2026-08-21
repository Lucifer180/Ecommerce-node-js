const { MongoMemoryReplSet } = require("mongodb-memory-server");

/**
 * Boots a single-node in-memory replica set for the whole test run.
 *
 * It has to be a replica set rather than a standalone mongod: checkout wraps
 * its writes in a transaction, and MongoDB only offers transactions on top of
 * an oplog. A standalone server would fail every order test with
 * "Transaction numbers are only allowed on a replica set member or mongos".
 */
module.exports = async () => {
    const replSet = await MongoMemoryReplSet.create({
        replSet: { count: 1, storageEngine: "wiredTiger" },
    });

    // Workers inherit this, so nothing in the suite touches a real database.
    process.env.MONGO_URI = replSet.getUri();

    globalThis.__MONGO_REPLSET__ = replSet;
};
