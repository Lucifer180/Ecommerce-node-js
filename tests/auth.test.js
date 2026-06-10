const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");
const connectDb = require("../src/config/db");
const redis = require("../src/config/redis");
require("dotenv").config();

beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
        await connectDb();
    }
});

afterAll(async () => {
    await mongoose.connection.close();

    if (redis) {
        await redis.quit(); // ioredis safe close
    }
});

describe("Auth API", () => {
    it("should register and login a user", async () => {
        const email = `test${Date.now()}@example.com`;
        const password = "12345678";

        await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email,
                password
            });

        const loginRes = await request(app)
            .post("/api/auth/login")
            .send({
                email,
                password
            });

        expect(loginRes.statusCode).toBe(200);
        expect(loginRes.body.accessToken).toBeDefined();
        expect(typeof loginRes.body.accessToken).toBe("string");
    });
});