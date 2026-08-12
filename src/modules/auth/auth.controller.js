const asyncHandler = require("../../shared/utils/asyncHandler");
const authService = require("./auth.service");
const emailQueue = require("../../queues/email.queue")
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

exports.getForgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const { user, resetToken } = await authService.getforgotPassword(email);

    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/reset-password/${resetToken}`;

    await emailQueue.add("forgot-password", {
        to: user.email,
        subject: "password reset request",
        text: `Reset your password using the following link:\n\n${resetUrl}\n\nThis link expires in 15 minutes.`,
        html: `
        <h2>Password Reset</h2>
            <p>You requested a password reset.</p>
            <p>
                <a href="${resetUrl}">Click here to reset your password</a>
            </p>
            <p>This link will expire in 15 minutes.</p>
        `,
    });
    res.status(200).json({
        success: true,
        message: "Password reset email has been queued"
    })

});

exports.ResetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    await authService.resetPassword(token, password);

    res.status(200).json({
        success: true,
        message: "Password reset successfully"
    });
})