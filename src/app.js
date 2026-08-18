const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const xss = require("xss");
const helmet = require("helmet");
const hpp = require("hpp");
const app = express();
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
require('dotenv').config();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, try again later",
});


app.set("trust proxy", 1);
app.use(express.json());
app.use(morgan("dev"));
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
const emailRoutes = require("./modules/mail/index");
const uploadRoutes = require("./modules/uploads/upload.routes");
const notificationRoutes = require("./modules/notifications/notification.routes");

app.use("/api", limiter);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/test-email", emailRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const errorHandler = require("./shared/errors/error.middleware");
app.use(errorHandler);
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
    });
});

module.exports = app;
