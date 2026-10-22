const logger = require("../utils/logger");
const AppError = require("./AppError");

/**
 * Decides the status code to send.
 *
 * Only a code we set ourselves is trusted. Third-party SDK errors carry their
 * own `statusCode` — Razorpay answers 401 for a bad API key, S3 answers 403 for
 * a bucket policy problem — and passing those straight through tells the browser
 * that *the user* is unauthorised. A client that refreshes its token on 401 then
 * logs the user out over what is actually a server misconfiguration.
 */
const resolveStatus = (err) => {
    if (err instanceof AppError || err.isOperational === true) {
        return err.statusCode || 500;
    }

    // Malformed JSON from body-parser, and anything else that marks itself
    // safe to show the client.
    if (err.expose === true && (err.status || err.statusCode)) {
        return err.status || err.statusCode;
    }

    // Mongoose validation problems are the caller's fault, not ours.
    if (err.name === "ValidationError") return 400;
    if (err.name === "CastError") return 400;
    if (err.code === 11000) return 409;

    return 500;
};

const resolveMessage = (err, statusCode) => {
    if (err instanceof AppError || err.isOperational === true || err.expose === true) {
        return err.message;
    }

    if (err.name === "CastError") return `Invalid ${err.path || "identifier"}`;
    if (err.name === "ValidationError") return Object.values(err.errors || {}).map((e) => e.message).join(", ") || "Validation failed";
    if (err.code === 11000) return "That record already exists";

    // Never surface an unexpected error's text: it leaks internals, and the
    // full message and stack are already in the log above.
    return statusCode === 500 ? "Something went wrong" : err.message;
};

// `next` is unused but required: Express identifies error handlers by arity.
module.exports = (err, req, res, next) => {
    const statusCode = resolveStatus(err);

    logger.error({
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method,
        statusCode,
        // Kept so a masked 500 is still traceable to its upstream cause.
        upstreamStatus: err.statusCode || err.status,
        name: err.name,
    });

    res.status(statusCode).json({
        success: false,
        message: resolveMessage(err, statusCode),
    });
};
