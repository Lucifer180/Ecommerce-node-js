const request = require("supertest");
const app = require("../src/app");
const Product = require("../src/modules/products/product.model");
const Cart = require("../src/modules/cart/cart.model");
const Order = require("../src/modules/orders/order.model");
const db = require("./helpers/db");

beforeAll(db.connect);
afterAll(db.disconnect);
beforeEach(db.clear);

/** Registers a user and returns their bearer token and id. */
const createShopper = async (index) => {
    const res = await request(app).post("/api/auth/register").send({
        name: `Shopper ${index}`,
        email: `shopper${index}-${Date.now()}@example.com`,
        password: "12345678",
    });

    return { token: res.body.accessToken, userId: res.body.user._id };
};

const checkout = (token) =>
    request(app).post("/api/orders").set("Authorization", `Bearer ${token}`);

describe("Checkout under concurrency", () => {
    it("never sells more units than are in stock", async () => {
        const STOCK = 5;
        const SHOPPERS = 9;

        const product = await Product.create({
            name: "Flash Sale Item",
            price: 100,
            stock: STOCK,
        });

        const shoppers = await Promise.all(
            Array.from({ length: SHOPPERS }, (_, i) => createShopper(i))
        );

        await Cart.insertMany(
            shoppers.map(({ userId }) => ({
                user: userId,
                items: [{ product: product._id, quantity: 1 }],
            }))
        );

        // The whole point: these go out together, not one after another.
        const responses = await Promise.all(
            shoppers.map(({ token }) => checkout(token))
        );

        const placed = responses.filter((res) => res.statusCode === 201);
        const rejected = responses.filter((res) => res.statusCode === 409);

        expect(placed).toHaveLength(STOCK);
        expect(rejected).toHaveLength(SHOPPERS - STOCK);

        const after = await Product.findById(product._id);
        expect(after.stock).toBe(0);

        expect(await Order.countDocuments()).toBe(STOCK);
    });

    it("rolls stock back when a later line item is unavailable", async () => {
        // Regression test for the stock decrement escaping the transaction: the
        // first item used to stay decremented after the order was aborted.
        const available = await Product.create({ name: "In stock", price: 100, stock: 10 });
        const scarce = await Product.create({ name: "Sold out", price: 200, stock: 0 });

        const { token, userId } = await createShopper("rollback");

        await Cart.create({
            user: userId,
            items: [
                { product: available._id, quantity: 2 },
                { product: scarce._id, quantity: 1 },
            ],
        });

        const res = await checkout(token);

        expect(res.statusCode).toBe(409);

        const untouched = await Product.findById(available._id);
        expect(untouched.stock).toBe(10);

        expect(await Order.countDocuments()).toBe(0);

        // The cart survives a failed checkout so the customer can retry.
        const cart = await Cart.findOne({ user: userId });
        expect(cart.items).toHaveLength(2);
    });

    it("charges the catalogue price, not a client-supplied one", async () => {
        const product = await Product.create({ name: "Lamp", price: 1499, stock: 3 });
        const { token, userId } = await createShopper("pricing");

        await Cart.create({
            user: userId,
            items: [{ product: product._id, quantity: 2 }],
        });

        const res = await checkout(token).send({ totalPrice: 1 });

        expect(res.statusCode).toBe(201);
        expect(res.body.data.totalPrice).toBe(2998);
    });

    it("rejects a checkout with an empty cart", async () => {
        const { token } = await createShopper("empty");

        const res = await checkout(token);

        expect(res.statusCode).toBe(400);
    });
});
