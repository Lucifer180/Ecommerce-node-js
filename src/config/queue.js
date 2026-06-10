const IORedis = require("ioredis");
require("dotenv").config();

const connection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
});

connection.on("connect", () => {
    console.log("Redis connected");
});

connection.on("error", (err) => {
    console.error("Redis connection error:", err.message);
});

module.exports = connection;
