const User = require("./user.model");
const AppError = require("../../shared/errors/AppError");

const allUsers = async () => {
    const users = await User.find();
    return users;
};

const updateRole = async (id, role) => {
    return User.findByIdAndUpdate(id, { role }, { returnDocument: "after" });
};
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

/** `refreshToken` is `select: false`, so it has to be asked for explicitly. */
const findUserByIdWithRefreshToken = async (userId) => {
    return User.findById(userId).select("+refreshToken");
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
    return User.findByIdAndUpdate(userId, { refreshToken }, { returnDocument: "after" });
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
    findUserByEmail, findUserById, findUserByIdWithRefreshToken, createUser, saverefreshToken, forgotPassword, findUserByRefreshToken, updatePassword, allUsers, updateRole
}