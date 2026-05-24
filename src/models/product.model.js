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
    image: String,

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema.index({
    name: "text",
    description: "text",
      category: 1,
    price: 1 
}));