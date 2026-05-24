const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const xss = require("xss");
const helmet = require("helmet");
const hpp = require("hpp");
const app = express();
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, try again later",
})
app.use(express.json());

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
app.use(cors());
const cartRoutes = require("./routes/cart.routes");
const productRoutes = require("./routes/product.routes");
const authRoutes = require("./routes/auth.routes");
const orderRoutes = require("./routes/order.routes");

app.use("/api", limiter);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.get("/", (req, res) => {
    res.send("Hello World!");
});

const errorHandler = require("./middlewares/error.middleware");
app.use(errorHandler);
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
    });
});

module.exports = app;
