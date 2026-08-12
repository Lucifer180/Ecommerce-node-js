const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    originalName: {
        type: String,
        required: true,
        trim: true
    },
    s3Key: {
        type: String,
        required: true,
        unique: true
    },
    mimeType: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ["profile", "product"],
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Upload", uploadSchema);
