const User = require("../../models/user.model");

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

const saverefreshToken = async(userId,refreshToken)=>{
   return User.findByIdAndUpdate(userId,{refreshToken},{new:true})
}

module.exports = {
    findUserByEmail, findUserById, createUser,saverefreshToken
}