const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const keyword = require('../keyword/keyword');
const filter = require('../filter/loginFilter')
const User = require('../models/userModel');

// Register new user
const register = async (req) => {
  let response;
  
  // Check incoming data
  filter.checkRegister(req.body)

  try {
    const user = new User({
      ...req.body,
      hash_password: bcrypt.hashSync(req.body.password, 10),
      id: uuid.v4()
    });
    const newUser = await user.save()
    response = {
      id: newUser.id,
      username: newUser.username,
      shopCartItems: newUser.shopcart.length
    }
  } catch (error) {
    throw new Error('There was a problem adding new user')
  }

  return response
}

// signin user to get token
const signIn = async (req) => {
  let user

  // Check incoming data
  filter.checkLogin(req.body)
  
  try {
    user = await User.findOne({ email: req.body.email }).exec()
  } catch (error) {
    throw new Error(`${error}`)
  }

  if (!user || !user.comparePassword(req.body.password, user.hash_password)) {
    throw new Error('Authentication failed, wrong user of password.')
  }

  return {
    token: jwt.sign({
      email: user.email,
      username: user.username,
      id: user.id,
    },
    keyword),
    username: user.username,
    id: user.id
  }
}

module.exports = {
  signIn,
  register
};
