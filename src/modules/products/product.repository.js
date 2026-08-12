const Product = require("./product.model");

exports.create = async (productData) => {
  return await Product.create(productData);
};

exports.find = async (query, skip, limitNum) => {
  return await Product.find(query).populate("images").skip(skip).limit(limitNum).lean();
};

exports.countDocuments = async (query) => {
  return await Product.countDocuments(query);
};

exports.findById = async (id) => {
  return await Product.findById(id).populate("images");
};

exports.findByIdAndUpdate = async (id, updateData) => {
  return await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

exports.findByIdAndDelete = async (id) => {
  return await Product.findByIdAndDelete(id);
};
