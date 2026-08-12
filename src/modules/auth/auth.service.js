const jwt = require("jsonwebtoken");
const authRepository = require("./auth.repository");
const AppError = require("../../shared/errors/AppError");
const crypto = require("crypto")
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

const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new AppError("No refresh Token", 401);
    };

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await authRepository.findUserById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
        throw new AppError("invalid refresh Token", 401);
    };

    return generateAccessToken(user._id);
};

const logoutUser = async (userId) => {
    return authRepository.saverefreshToken(userId, null);
};

const getforgotPassword = async (email) => {
    const user = await authRepository.forgotPassword(email);

    if (!user) {
        throw new AppError("user not found", 404);
    };
    return user;
};

const resetPassword = async (token,newPassword) =>{
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
  const user = await authRepository.findUserByRefreshToken(hashedToken);

  if(!user) {
    throw new AppError("Invalid or expired reset token", 400);
  };

  await authRepository.updatePassword(user,newPassword);

  return user;
};


module.exports = {
    loginUser, registerUser, getCurrentUser, getforgotPassword, refreshAccessToken, logoutUser, resetPassword
}