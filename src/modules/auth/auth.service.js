const authRepository = require("./auth.repository");
const AppError = require("../../shared/errors/AppError");
const { generateAccessToken, generateRefreshToken } = require("../../shared/utils/generateToken");

const registerUser = async ({ name, email, password }) => {
    const existingUser = await authRepository.findUserByEmail(email);

    if (existingUser) {
        throw new AppError("user already exists", 400);
    }
    const user = await authRepository.createUser({
        name, email, password
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await authRepository.saverefreshToken(user._id, refreshToken)
    return {
        user, accessToken, refreshToken
    }
}

const loginUser = async ({ email, password }) => {
    const user = await authRepository.findUserByEmail(email, true);

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    };

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new AppError("invalid email or password", 401);
    };

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await authRepository.saverefreshToken(user._id, refreshToken);
    return {
        user, accessToken, refreshToken
    }
};

const getCurrentUser = async (userId) => {
    const user = await authRepository.findUserById(userId);

    if (!user) {
        throw new AppError("user not found", 404);
    };

    return user;
};

module.exports = {
    loginUser, registerUser, getCurrentUser
}