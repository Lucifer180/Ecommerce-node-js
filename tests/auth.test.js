const request = require("supertest");
const app = require("../src/app");
const User = require("../src/modules/auth/user.model");
const db = require("./helpers/db");

beforeAll(db.connect);
afterAll(db.disconnect);
beforeEach(db.clear);

const register = (overrides = {}) =>
    request(app).post("/api/auth/register").send({
        name: "Test User",
        email: `test${Date.now()}${Math.random()}@example.com`,
        password: "12345678",
        ...overrides,
    });

describe("Auth API", () => {
    it("registers and logs a user in", async () => {
        const email = `test${Date.now()}@example.com`;
        const password = "12345678";

        const registerRes = await register({ email, password });
        expect(registerRes.statusCode).toBe(201);

        const loginRes = await request(app)
            .post("/api/auth/login")
            .send({ email, password });

        expect(loginRes.statusCode).toBe(200);
        expect(typeof loginRes.body.accessToken).toBe("string");
        expect(loginRes.body.user.role).toBe("user");
    });

    it("rejects a password under eight characters", async () => {
        const res = await register({ password: "short" });

        expect(res.statusCode).toBe(400);
    });

    it("does not let a signed-in user promote themselves to admin", async () => {
        // Regression test: the role endpoint used to update req.user, so any
        // authenticated caller could hand themselves admin.
        const registerRes = await register();
        const token = registerRes.body.accessToken;
        const userId = registerRes.body.user._id;

        const res = await request(app)
            .put("/api/auth")
            .set("Authorization", `Bearer ${token}`)
            .send({ userId, role: "admin" });

        expect(res.statusCode).toBe(403);

        const user = await User.findById(userId);
        expect(user.role).toBe("user");
    });

    it("rejects an unauthenticated request for a protected route", async () => {
        const res = await request(app).get("/api/auth/me");

        expect(res.statusCode).toBe(401);
    });
});
