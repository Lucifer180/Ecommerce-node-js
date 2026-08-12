const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    price: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 0
    },
    category: String,
    images: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Upload"
        }
    ],
    // seller: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //     required: true
    // }

}, { timestamps: true });

productSchema.index({
    name: "text",
    description: "text",
    category: 1,
    price: 1
});

module.exports = mongoose.model("Product", productSchema);
