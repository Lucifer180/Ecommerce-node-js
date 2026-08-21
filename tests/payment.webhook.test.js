const crypto = require("crypto");
const request = require("supertest");
const app = require("../src/app");
const Product = require("../src/modules/products/product.model");
const Order = require("../src/modules/orders/order.model");
const db = require("./helpers/db");

beforeAll(db.connect);
afterAll(db.disconnect);
beforeEach(db.clear);

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;
const RAZORPAY_ORDER_ID = "order_TEST123";

const sign = (rawBody, secret = WEBHOOK_SECRET) =>
    crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

const eventBody = (event, paymentId = "pay_TEST123") =>
    JSON.stringify({
        event,
        payload: {
            payment: {
                entity: {
                    id: paymentId,
                    order_id: RAZORPAY_ORDER_ID,
                },
            },
        },
    });

const postWebhook = (rawBody, signature) =>
    request(app)
        .post("/api/payments/webhook")
        .set("Content-Type", "application/json")
        .set("x-razorpay-signature", signature)
        .send(rawBody);

/** A pending order with two units of a product already reserved against it. */
const seedPendingOrder = async () => {
    const product = await Product.create({ name: "Headphones", price: 999, stock: 8 });

    const order = await Order.create({
        user: "64b7f0f0f0f0f0f0f0f0f0f0",
        items: [{ product: product._id, quantity: 2, price: 999 }],
        totalPrice: 1998,
        status: "pending",
        razorpayOrderId: RAZORPAY_ORDER_ID,
    });

    return { product, order };
};

describe("Razorpay webhook", () => {
    it("rejects an unsigned request", async () => {
        await seedPendingOrder();
        const body = eventBody("payment.captured");

        const res = await postWebhook(body, "");

        expect(res.statusCode).toBe(400);

        const order = await Order.findOne({ razorpayOrderId: RAZORPAY_ORDER_ID });
        expect(order.status).toBe("pending");
    });

    it("rejects a signature made with the wrong secret", async () => {
        await seedPendingOrder();
        const body = eventBody("payment.captured");

        const res = await postWebhook(body, sign(body, "not-the-secret"));

        expect(res.statusCode).toBe(400);

        const order = await Order.findOne({ razorpayOrderId: RAZORPAY_ORDER_ID });
        expect(order.status).toBe("pending");
    });

    it("rejects a valid signature over a tampered body", async () => {
        await seedPendingOrder();
        const signedBody = eventBody("payment.captured");
        const tamperedBody = eventBody("payment.captured", "pay_ATTACKER");

        const res = await postWebhook(tamperedBody, sign(signedBody));

        expect(res.statusCode).toBe(400);
    });

    it("marks the order paid on a correctly signed payment.captured", async () => {
        await seedPendingOrder();
        const body = eventBody("payment.captured");

        const res = await postWebhook(body, sign(body));

        expect(res.statusCode).toBe(200);

        const order = await Order.findOne({ razorpayOrderId: RAZORPAY_ORDER_ID });
        expect(order.status).toBe("paid");
        expect(order.razorpayPaymentId).toBe("pay_TEST123");
    });

    it("is idempotent when Razorpay redelivers an event", async () => {
        const { product } = await seedPendingOrder();
        const body = eventBody("payment.captured");

        const first = await postWebhook(body, sign(body));
        const second = await postWebhook(body, sign(body));

        // A non-2xx would make Razorpay keep retrying forever.
        expect(first.statusCode).toBe(200);
        expect(second.statusCode).toBe(200);

        expect(await Order.countDocuments({ status: "paid" })).toBe(1);

        const after = await Product.findById(product._id);
        expect(after.stock).toBe(8);
    });

    it("releases reserved stock on payment.failed", async () => {
        const { product } = await seedPendingOrder();
        const body = eventBody("payment.failed");

        const res = await postWebhook(body, sign(body));

        expect(res.statusCode).toBe(200);

        const order = await Order.findOne({ razorpayOrderId: RAZORPAY_ORDER_ID });
        expect(order.status).toBe("failed");

        // The two units reserved at checkout go back on the shelf.
        const after = await Product.findById(product._id);
        expect(after.stock).toBe(10);
    });

    it("does not release stock twice on a redelivered failure", async () => {
        const { product } = await seedPendingOrder();
        const body = eventBody("payment.failed");

        await postWebhook(body, sign(body));
        await postWebhook(body, sign(body));

        const after = await Product.findById(product._id);
        expect(after.stock).toBe(10);
    });

    it("acknowledges a signed event it does not act on", async () => {
        const body = JSON.stringify({ event: "refund.created", payload: {} });

        const res = await postWebhook(body, sign(body));

        expect(res.statusCode).toBe(200);
    });
});
