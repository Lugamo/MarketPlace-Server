const mongoose = require('mongoose');
const uuid = require('uuid/');

const Product = require('../models/productModel');
const filter = require('../filter/productFilter')

// get the products, can be added querys to filter data
const getProducts = async (req) => {
  let query = {};
  let response = {};

  filter.checkPage(req.body)

  const options = {
    select: '-_id -__v -description',
    page: (Number(req.query.page) || 1),
    limit: 15,
  };

  if (req.query) {
    filter.checkQuery(req.query)
    
    // Name filter
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: 'i' }
    }

    // Category filter
    if (req.query.category) {
      query.category = req.query.category
    }

    // Rating filter
    if (req.query.rating) {
      query.rating = req.query.rating
    }

    // Price filter
    if (req.query.minprice || req.query.maxprice) {
      const price = {}

      if (req.query.minprice) {
        price['$gte'] = req.query.minprice
      }

      if (req.query.maxprice) {
        price['$lte'] = req.query.maxprice
      }

      query.price = price
    }
  }

  try {
    const data = await Product.paginate(query, options)
    response = {
      data: data.docs,
      total: data.totalDocs,
      navigation: {
        actual: data.page,
        total: data.totalPages,
        next: data.nextPage,
        previous: data.prevPage,
      }
    }
  } catch (error) {
    throw new Error ('There was an error getting the products')
  }

  return response
}

// get all the info about the product
const getProductbyId = async (req) => {
  let product = {};
  filter.checkId(req.params.id)

  try {
    product = await Product.findOne({ id: req.params.id }, { _id: 0, __v: 0 }).exec()
  } catch (error) {
    throw new Error('There was a problem getting the product')
  }

  if (!product) {
    throw new Error('Product not found')
  }

  return product
}

// Add new product
const addProduct = async (req) => {
  let response;

  try {
    const product = new Product({
      ...req.body,
      id: uuid.v4()
    });
    const newProduct = await product.save()
    response = {
      id: newProduct.id,
      username: newProduct.name,
      price: newProduct.price
    }
  } catch (error) {
    throw new Error('There was a problem adding new product')
  }

  return response
}

module.exports = {
  getProducts,
  getProductbyId,
  addProduct
};
