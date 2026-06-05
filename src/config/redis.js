const redis = require("redis");

const client = redis.createClient({
    url: process.env.REDIS_URL
});

client.on("error", (err) => {
    console.log("redis error", err);
});

const connectRedis = async () => {
    await client.connect();
    console.log("connected to redis");
};

module.exports = { client, connectRedis };