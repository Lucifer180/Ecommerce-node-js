const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const emailQueue = require("../queues/email.queue");

// const generateToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
// };

const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
}
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) { return next(new AppError("User already exists", 400)) };

    const user = await User.create({ name, email, password });
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    const data = {
        to: user.email,
        subject: "Welcome to our platform",
        text: `Welcome ${user.name}, thank you for joining us.`
    };

    await emailQueue.add("sendWelcomeEmail", data, {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay:1000,
        }
    })
    
    res.status(201).json({
        accessToken,
        refreshToken,
    });
});

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password")
    const accessToken = generateAccessToken(user._id);;
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    if (!user || !(await user.comparePassword(password))) {
        return next(new AppError("Invalid credentials", 401));
    }
    res.status(200).json({
        accessToken,
        refreshToken,
    })
})

exports.refreshToken = asyncHandler(async (req, res, next) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return next(new AppError("No refresh Token", 401));

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) return next(new AppError("invalid refresh Token", 401));

    const newAccessToken = generateAccessToken(user._id);

    res.status(200).json({
        accessToken: newAccessToken,
    });
});

exports.logout = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    user.refreshToken = null;
    await user.save();

    res.json({
        message: "Logged out successfully",
    });
});