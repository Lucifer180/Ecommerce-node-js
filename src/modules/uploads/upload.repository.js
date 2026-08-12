const Upload = require("./upload.model");

const createUpload = async (payload) => {
    return await Upload.create(payload)
};

const findUploadById = async (uploadId) => {
    return await Upload.findById(uploadId)
}

const findUploadByUser = async (userId) => {
    return await Upload.find({ user: userId }).sort({ createdAt: -1 })
};

const deleteUpload = async (uploadId) => {
    return await Upload.findByIdAndDelete(uploadId);
}
module.exports = { createUpload, findUploadById, findUploadByUser, deleteUpload };