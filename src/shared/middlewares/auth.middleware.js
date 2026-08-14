const jwt = require("jsonwebtoken");
const User = require("../../modules/auth/user.model");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../errors/AppError");

exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new AppError("Not authorized", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    // The token can outlive the account it points at.
    if (!user) {
        return next(new AppError("Not authorized", 401));
    }

    req.user = user;

    next();
});

/**
 * Restricts a route to the given roles. Must run after `protect`.
 *
 * Usage: router.post("/", protect, authorize("admin"), handler)
 */
exports.authorize = (...roles) => (req, res, next) => {
    if (!req.user) {
        return next(new AppError("Not authorized", 401));
    }

    if (!roles.includes(req.user.role)) {
        return next(new AppError("You do not have permission to perform this action", 403));
    }

    next();
};
