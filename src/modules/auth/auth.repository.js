const User = require("./user.model");

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

const saverefreshToken = async (userId, refreshToken) => {
    return User.findByIdAndUpdate(userId, { refreshToken }, { new: true })
}

const forgotPassword = async (email) => {
    const user = await User.find({ email });

    if (!user) { throw new AppError("user not found", 404) };
    console.log(user,"user");
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });
    return resetToken

}

module.exports = {
    findUserByEmail, findUserById, createUser, saverefreshToken, forgotPassword
}