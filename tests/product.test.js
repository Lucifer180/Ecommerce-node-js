const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");
const connectDb = require("../src/config/db");
const redis = require("../src/config/queue");
require("dotenv").config();
jest.setTimeout(30000);

beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
        await connectDb();
    }
});

afterAll(async () => {
    await connectDb.disconnectDb();

    if (redis) {
        await redis.quit(); // important for ioredis
    }
});

beforeEach(async () => {
    // optional but recommended for consistency
    await redis.flushDb?.();
});

describe("Product API", () => {
    it("should get all Products", async () => {
        const res = await request(app).get("/api/products");

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });
});