const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const xss = require("xss");
const helmet = require("helmet");
const hpp = require("hpp");
const app = express();
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
require('dotenv').config({ quiet: true });

const WEBHOOK_PATH = "/api/payments/webhook";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, try again later",
    // Razorpay retries webhooks from a small pool of IPs; throttling them would
    // turn a burst of legitimate payment events into lost orders.
    skip: (req) => req.originalUrl === WEBHOOK_PATH,
});


app.set("trust proxy", 1);

app.use(express.json({
    // Keep the exact bytes for the payment webhook: its HMAC covers the raw
    // payload, and re-serialising the parsed object would not reproduce it.
    verify: (req, res, buf) => {
        if (req.originalUrl === WEBHOOK_PATH) {
            req.rawBody = buf;
        }
    }
}));
// Request logging is noise in the test runner.
if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
}
const sanitizeXss = (value) => {
    if (typeof value === "string") return xss(value);
    if (Array.isArray(value)) return value.map(sanitizeXss);
    if (value && typeof value === "object") {
        Object.keys(value).forEach((key) => {
            value[key] = sanitizeXss(value[key]);
        });
    }
    return value;
};

const sanitizeRequestValue = (value) => sanitizeXss(mongoSanitize.sanitize(value));

app.use((req, res, next) => {
    // The webhook body is signature-verified verbatim; rewriting it here would
    // only risk diverging from what was signed.
    if (req.originalUrl === WEBHOOK_PATH) return next();

    if (req.body) req.body = sanitizeRequestValue(req.body);
    if (req.params) req.params = sanitizeRequestValue(req.params);
    if (req.query) {
        Object.defineProperty(req, "query", {
            value: sanitizeRequestValue({ ...req.query }),
            writable: true,
            configurable: true,
            enumerable: true,
        });
    }
    next();
});


app.use(hpp());
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
const cartRoutes = require("./modules/cart/cart.routes");
const productRoutes = require("./modules/products/product.routes");
const authRoutes = require("./modules/auth/auth.routes")
const orderRoutes = require("./modules/orders/order.routes");
const paymentRoutes = require("./modules/payments/payment.routes");
const uploadRoutes = require("./modules/uploads/upload.routes");
const notificationRoutes = require("./modules/notifications/notification.routes");

// Probed by the deploy pipeline after every release, so it stays outside /api
// and ahead of the rate limiter.
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
    });
});

app.use("/api", limiter);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Must stay last: Express only routes errors to a handler registered after the
// middleware and routes that raise them.
const errorHandler = require("./shared/errors/error.middleware");
app.use(errorHandler);

module.exports = app;
