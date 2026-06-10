const IORedis = require("ioredis");
require("dotenv").config();

let connection;

if (process.env.NODE_ENV === "test") {
    const RedisMock = require("ioredis-mock");
    connection = new RedisMock();
} else {
    connection = new IORedis(process.env.REDIS_URL, {
        maxRetriesPerRequest: null,
    });
}

connection.on("connect", () => {
    if (process.env.NODE_ENV !== "test") {
        console.log("Redis connected");
    }
});

connection.on("error", (err) => {
    if (process.env.NODE_ENV !== "test") {
        console.error("Redis connection error:", err.message);
    }
});

module.exports = connection;
