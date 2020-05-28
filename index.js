const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const asyncHandler = require('express-async-handler')

const loginController = require('./controller/loginController')
const productController = require('./controller/productController')
const credentialController = require('./controller/credentialController')
const userController = require('./controller/userController')

const app = express();

app.use(bodyParser.json({
  limit: '50mb',
  extended: true
}));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));

app.use(cors({
  origin: 'https://sleepy-borg-14aaba.netlify.app',
  credentials: true,
}));

// Create new user
const registerUser = async (req, res) => {
  try {
    const newUser = await loginController.register(req)
    res.status(200).send(newUser)
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
}

app.post('/auth/register', asyncHandler(registerUser))

// Login new user
const loginUser = async (req, res) => {
  try {
    const user = await loginController.signIn(req)
    res.status(200).send(user)
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
}

app.post('/auth/login', asyncHandler(loginUser))

// Add new product
const addProduct = async (req, res) => {
  try {
    const product = await productController.addProduct(req)
    res.status(200).send(product)
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
}

app.post('/product', credentialController.verifyCredentials, asyncHandler(addProduct))

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await productController.getProducts(req)
    res.status(200).send(products)
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
}

app.get('/product', asyncHandler(getProducts))

// Get product by id
const getProductById = async (req, res) => {
  try {
    const product = await productController.getProductbyId(req)
    res.status(200).send(product)
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
}

app.get('/product/:id', asyncHandler(getProductById))

// Get user shopcart
const getUserShopcart = async (req, res) => {
  try {
    const shopcart = await userController.getShopcart(req)
    res.status(200).send(shopcart)
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
}

app.get('/user/shopcart', credentialController.verifyCredentials, asyncHandler(getUserShopcart))

// Add item to shopcart
const addToShopcart = async (req, res) => {
  try {
    await userController.addProduct(req)
    res.status(200).send()
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
}

app.put('/user/shopcart/add/:productId', credentialController.verifyCredentials, asyncHandler(addToShopcart))

// Remove item from shopcart
const removeFromShopcart = async (req, res) => {
  try {
    await userController.removeProduct(req)
    res.status(200).send()
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
}

app.put('/user/shopcart/remove/:productId', credentialController.verifyCredentials, asyncHandler(removeFromShopcart))

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3001

app.listen(port, host, () => {
  console.log(`Started up at port ${port}`);
});
