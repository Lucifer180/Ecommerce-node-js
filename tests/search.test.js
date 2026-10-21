const request = require("supertest");

// The crawler drives real browsers; never reach it from the suite.
jest.mock("../src/modules/products/crawler.client", () => ({ search: jest.fn() }));

const app = require("../src/app");
const crawlerClient = require("../src/modules/products/crawler.client");
const redis = require("../src/config/queue");
const AppError = require("../src/shared/errors/AppError");

const crawlResult = (sources = [{ platform: "flipkart", status: "ok", count: 1, durationMs: 5 }]) => ({
    query: "shirt",
    total: 1,
    sources,
    groups: [
        {
            id: "g1",
            title: "Cotton Shirt",
            image: "https://example.com/shirt.jpg",
            offers: [{ platform: "flipkart", price: 499, url: "https://www.flipkart.com/p/1", image: "" }],
        },
    ],
});

beforeEach(async () => {
    crawlerClient.search.mockReset();
    await redis.flushall();
});

describe("GET /api/products/search", () => {
    it("rejects a missing or too-short keyword without crawling", async () => {
        const missing = await request(app).get("/api/products/search");
        const short = await request(app).get("/api/products/search?keyword=a");

        expect(missing.statusCode).toBe(400);
        expect(short.statusCode).toBe(400);
        expect(crawlerClient.search).not.toHaveBeenCalled();
    });

    it("returns crawler results and serves repeats from cache", async () => {
        crawlerClient.search.mockResolvedValue(crawlResult());

        const first = await request(app).get("/api/products/search?keyword=Shirt");
        const second = await request(app).get("/api/products/search?keyword=%20shirt%20");

        expect(first.statusCode).toBe(200);
        expect(first.body.success).toBe(true);
        expect(first.body.data.groups[0].title).toBe("Cotton Shirt");
        expect(second.body.data).toEqual(first.body.data);
        expect(crawlerClient.search).toHaveBeenCalledTimes(1);
        expect(crawlerClient.search).toHaveBeenCalledWith("shirt");
    });

    it("does not cache a result where every store failed", async () => {
        crawlerClient.search.mockResolvedValue(
            crawlResult([{ platform: "flipkart", status: "failed", count: 0, durationMs: 5, error: "blocked" }])
        );

        await request(app).get("/api/products/search?keyword=shirt");
        await request(app).get("/api/products/search?keyword=shirt");

        expect(crawlerClient.search).toHaveBeenCalledTimes(2);
    });

    it("passes crawler failures through as operational errors", async () => {
        crawlerClient.search.mockRejectedValue(new AppError("Product search timed out, try again", 504));

        const res = await request(app).get("/api/products/search?keyword=shirt");

        expect(res.statusCode).toBe(504);
    });
});
