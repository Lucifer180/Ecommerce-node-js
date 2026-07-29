const asyncHandler = require("../../shared/utils/asyncHandler");
const authService = require("./auth.service");
const AppError = require("../../shared/errors/AppError");
const sendEmail = require("../../shared/utils/sendEmail");
const User = require("./user.model")
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

exports.refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    const accessToken = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
        accessToken,
    });
});

exports.logout = asyncHandler(async (req, res) => {
    await authService.logoutUser(req.user._id);

    res.json({
        message: "Logged out successfully",
    });
});

exports.getMe = asyncHandler(async (req, res) => {
    const user = await authService.getCurrentUser(req._id);
    res.status(200).json({
        success: true,
        user,
    })
})

exports.getforgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) { throw new AppError("email is required", 400) };

    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError("user not found", 404);
    }
    const resetToken = user.generatePasswordResetToken();

    await user.save({ validateBeforeSave: false });
    `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const resetUrl = `http://localhost:5000/api/auth/reset-password/${resetToken}`;

    try {
        await sendEmail({
            to: user.email,
            subject: "Password Reset Request",
            text: `Reset your password using the following link:\n\n${resetUrl}\n\nThis link expires in 15 minutes.`,
            html: `
                <h2>Password Reset</h2>
                <p>You requested to reset your password.</p>
                <p>
                    <a href="${resetUrl}">Click here to reset your password</a>
                </p>
                <p>This link will expire in 15 minutes.</p>
            `,
        })
        res.status(200).json({
            success: true,
            message: "password reset email sent."
        })
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save({ validateBeforeSave: false });

        throw new AppError("Email could not be sent", 500);
    }
})