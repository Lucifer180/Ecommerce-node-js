const { token } = require("morgan");
const asyncHandler = require("../../shared/utils/asyncHandler");
const authService = require("./auth.service");
const { refreshToken } = require("../../controllers/auth.controller");

exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const result = await authService.registerUser({
        name, email, password
    });

    res.status(201).json({
        success: true,
        acesstoken: result.accessToken,
        refreshToken: result.refreshToken,
        // user: {
        //     _id: result._id,
        //     name: result.user.name,
        //     email: result.user.email,
        //     role: result.user.role,
        // }
    });
});

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const result = await authService.loginUser({
        email, password
    });
    res.status(200).json({
        success: true,
        acesstoken: result.accessToken,
        refreshToken: result.refreshToken,
        // user: {
        //     _id: result.user._id,
        //     name: result.user.name,
        //     email: result.user.email,
        //     role: result.user.role
        // }
    })
});

exports.getMe = asyncHandler(async (req, res) => {
    const user = await authService.getCurrentUser(req._id);
    res.status(200).json({
        success: true,
        user,
    })
})