const request = require("supertest");

// Never call the paid LLM API from the suite.
jest.mock("../src/modules/recommendations/groq.client", () => ({ completeJson: jest.fn() }));

const app = require("../src/app");
const groq = require("../src/modules/recommendations/groq.client");
const redis = require("../src/config/queue");
const AppError = require("../src/shared/errors/AppError");

const shirt = { title: "Allen Solly Men Slim Fit Navy Blue Oxford Shirt", brand: "Allen Solly" };

beforeEach(async () => {
    groq.completeJson.mockReset();
    await redis.flushall();
});

describe("POST /api/recommendations", () => {
    it("rejects a missing or oversized title without calling the model", async () => {
        const missing = await request(app).post("/api/recommendations").send({});
        const huge = await request(app).post("/api/recommendations").send({ title: "x".repeat(201) });

        expect(missing.statusCode).toBe(400);
        expect(huge.statusCode).toBe(400);
        expect(groq.completeJson).not.toHaveBeenCalled();
    });

    it("returns cleaned suggestions and serves repeats from cache", async () => {
        groq.completeJson.mockResolvedValue({
            complete: [
                { category: "Trousers", query: "beige slim fit chinos", reason: "Neutral chinos balance a navy shirt." },
                { category: "Shoes", query: "  brown   leather loafers ", reason: "Smart-casual finish." },
            ],
            similar: [{ query: "navy oxford shirt men", reason: "Same style." }],
        });

        const first = await request(app).post("/api/recommendations").send(shirt);
        const second = await request(app).post("/api/recommendations").send(shirt);

        expect(first.statusCode).toBe(200);
        expect(first.body.success).toBe(true);
        expect(first.body.data.complete).toHaveLength(2);
        expect(first.body.data.complete[1].query).toBe("brown leather loafers");
        expect(second.body.data).toEqual(first.body.data);
        expect(groq.completeJson).toHaveBeenCalledTimes(1);
    });

    it("sends the product to the model as data, separate from the instructions", async () => {
        groq.completeJson.mockResolvedValue({ complete: [{ category: "Belt", query: "brown leather belt", reason: "" }] });

        await request(app).post("/api/recommendations").send(shirt);

        const { system, user } = groq.completeJson.mock.calls[0][0];
        expect(JSON.parse(user)).toEqual(shirt);
        expect(system).not.toContain(shirt.title);
    });

    it("drops malformed, duplicate and excess items from the model output", async () => {
        groq.completeJson.mockResolvedValue({
            complete: [
                { category: "Trousers", query: "black jeans", reason: "ok" },
                { category: "Trousers", query: "Black Jeans", reason: "duplicate" },
                { query: "no category" },
                { category: "Shoes", query: 42 },
                { category: "Belt", query: "black belt" },
                { category: "Watch", query: "silver watch" },
                { category: "Cap", query: "black cap" },
                { category: "Bag", query: "one too many" },
            ],
            similar: "not an array",
        });

        const res = await request(app).post("/api/recommendations").send(shirt);

        expect(res.body.data.complete.map((item) => item.query)).toEqual([
            "black jeans",
            "black belt",
            "silver watch",
            "black cap",
        ]);
        expect(res.body.data.similar).toEqual([]);
    });

    it("answers empty, without caching, when the model has nothing usable", async () => {
        groq.completeJson.mockResolvedValue({ complete: [], similar: [] });

        const res = await request(app).post("/api/recommendations").send(shirt);
        await request(app).post("/api/recommendations").send(shirt);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toEqual({ complete: [], similar: [] });
        expect(groq.completeJson).toHaveBeenCalledTimes(2);
    });

    it("passes model failures through as operational errors", async () => {
        groq.completeJson.mockRejectedValue(new AppError("Recommendations timed out, try again", 504));

        const res = await request(app).post("/api/recommendations").send(shirt);

        expect(res.statusCode).toBe(504);
    });
});
