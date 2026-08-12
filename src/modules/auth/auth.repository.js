const User = require("./user.model");
const AppError = require("../../shared/errors/AppError")
const findUserByEmail = async (email, includePassword = false) => {
    const query = User.findOne({ email });

    if (includePassword) {
        query.select("+password");
    }
    return query;
};

const findUserById = async (userId) => {
    return User.findById(userId);
};

const createUser = async (payload) => {
    return User.create(payload);
};

const forgotPassword = async (email) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError("user not found", 404);
    };

    const resetToken = user.generatePasswordResetToken();

    await user.save({ validateBeforeSave: false });

    return ({
        user, resetToken
    })
};

const saverefreshToken = async (userId, refreshToken) => {
    return User.findByIdAndUpdate(userId, { refreshToken }, { new: true, select: "+password" });
};

const findUserByRefreshToken = async (hashedToken) => {
    return User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {
            $gt: Date.now()
        }
    })
};

const updatePassword = async (user, password) => {
    user.password = password;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;

    return user.save();
};

module.exports = {
    findUserByEmail, findUserById, createUser, saverefreshToken, forgotPassword, findUserByRefreshToken, updatePassword
}