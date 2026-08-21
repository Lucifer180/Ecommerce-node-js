const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
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

    it("returns the current user for a valid token", async () => {
        const registerRes = await register();

        const res = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${registerRes.body.accessToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.user.email).toBe(registerRes.body.user.email);
    });

    // These must be 401, not 500. A refresh-on-401 interceptor is the standard
    // client pattern, so a 500 here means sessions die at token expiry instead
    // of renewing — and the user sees a server error rather than a re-login.
    it.each([
        ["a malformed token", "abc.def.ghi"],
        ["the literal string undefined", "undefined"],
    ])("answers 401 for %s", async (_label, token) => {
        const res = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(401);
    });

    it("answers 401 for an expired token", async () => {
        const expired = jwt.sign(
            { id: new mongoose.Types.ObjectId().toString() },
            process.env.JWT_SECRET,
            { expiresIn: -10 }
        );

        const res = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${expired}`);

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe("Session expired");
    });
});
