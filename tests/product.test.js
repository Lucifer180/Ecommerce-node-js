const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");
const connectDb = require("../src/config/db");
const { client, connectRedis } = require("../src/config/redis");
require("dotenv").config();

beforeAll(async () => {
    await connectDb();
    await connectRedis();
});

afterAll(async () => {
    await mongoose.connection.close();
    await client.disconnect();
});

describe("Product API", () => {
    it("should get all Products", async () => {
        const res = await request(app)
            .get("/api/products");

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

});