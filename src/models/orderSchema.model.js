const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    items:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
        },
        quantity:Number,
        price : Number,
    }],
    totalPrice:Number,
    status:{
        type:String,
        enum:["pending","paid","shipped","delivered"],
        default:"pending"
    }
},{timestamps:true});

module.exports = mongoose.model("Order",orderSchema);