const request = require("supertest");
const app = require("../src/app");
const Product = require("../src/modules/products/product.model");
const db = require("./helpers/db");

beforeAll(db.connect);
afterAll(db.disconnect);
beforeEach(db.clear);

describe("Product API", () => {
    it("lists products", async () => {
        await Product.create({ name: "Keyboard", price: 2500, stock: 4 });

        const res = await request(app).get("/api/products");

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].name).toBe("Keyboard");
    });

    it("returns 404 for a product that does not exist", async () => {
        const res = await request(app).get("/api/products/64b7f0f0f0f0f0f0f0f0f0f0");

        expect(res.statusCode).toBe(404);
    });

    it("refuses to create a product without an admin token", async () => {
        const res = await request(app)
            .post("/api/products")
            .send({ name: "Mouse", price: 500, stock: 10 });

        expect(res.statusCode).toBe(401);
    });
});
