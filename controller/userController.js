const Product = require('../models/productModel');
const User = require('../models/userModel');
const filter = require('../filter/userFilter')

// Add product to user shopcart
const addProduct = async (req) => {
  const userId = req.user.id;
  const productId = req.params.productId;
  let product = {};
  let shopcart = [];

  filter.checkIds(userId, productId)

  // Check product exist
  try {
    product = await Product.find({ id: productId }).exec();
  } catch(err) {
    throw new Error(`${err}`)
  }

  if (product.length === 0) {
    throw new Error('product id does not exist');
  }

  // Get user shopcart
  try {
    const search = await User.findOne({ id: userId }, { shopcart: 1, _id: 0 }).exec();
    shopcart = search.shopcart
  } catch(err) {
    throw new Error(`${err}`);
  }

  // update quantity product, else add to shopcart
  const productIndex = shopcart.findIndex(item => item.productId == productId);
  if (productIndex > -1) {
    shopcart[productIndex] = {
      productId: shopcart[productIndex].productId,
      quantity: shopcart[productIndex].quantity + 1
    };
  } else {
    shopcart.push({
      productId: productId,
      quantity: 1
    });
  }

  // Update shopcart
  try {
    await User.updateOne({ id: userId }, { $set: { shopcart: shopcart } }).exec()
  } catch(err) {
    throw new Error('There was a problem updating the shopcart');
  }
}

const removeProduct = async (req) => {
  const userId = req.user.id;
  const productId = req.params.productId;
  let shopcart = [];

  filter.checkIds(userId, productId)

  // Get user shopcart
  try {
    const search = await User.findOne({ id: userId }, { shopcart: 1, _id: 0 }).exec();
    shopcart = search.shopcart
  } catch(err) {
    throw new Error(`${err}`);
  }

  const productIndex = shopcart.findIndex(item => item.productId == productId);

  // if product remove it
  if (productIndex > -1) {
    shopcart = shopcart.filter(item => item.productId !== productId)
  } else {
    throw new Error('product id does not exist');
  }

  // Update shopcart
  try {
    await User.updateOne({ id: userId }, { $set: { shopcart: shopcart } }).exec()
  } catch(err) {
    throw new Error('There was a problem updating the shopcart');
  }
}

const getShopcart = async (req) => {
  let shopcart = []
  let idQty = {}
  const userId = req.user.id;

  filter.checkUserId(userId)

  // Get user shopcart
  try {
    const search = await User.findOne({ id: userId }, { shopcart: 1, _id: 0 }).exec();
    shopcart = search.shopcart
  } catch(err) {
    throw new Error(`${err}`);
  }

  // Create an object { productId: quantity, productId: quantity }
  for (let index = 0; index < shopcart.length; index++) {
    const element = shopcart[index];
    
    idQty[element.productId] = element.quantity
  }

  // Get product info
  try {
    // find the products with the ids on user shopcart
    shopcart = await Product.find({ id: { $in: Object.keys(idQty) } }, {  _id: 0, __v: 0, description: 0, created: 0, category: 0, quantity: 0 }).exec();
  } catch(err) {
    throw new Error('There was a problem getting the shopcart');
  }

  // Add quantity of the shopcart to the product info
  shopcart = shopcart.map((item) => {
    return {
      id: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: idQty[item.id]
    }
  })

  return shopcart
}

module.exports = {
  addProduct,
  removeProduct,
  getShopcart
};
