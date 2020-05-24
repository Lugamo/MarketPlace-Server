const jsonwebtoken = require('jsonwebtoken');
const keyword = require('../keyword/keyword');

// Check the JWT is valid
function verifyCredentials(req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], keyword, (err, decode) => {
      if (err) req.user = undefined;
      // add the info inside the token in the user variable
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    res.status(401).json({
      status: 401,
      message: 'You must be authenticated!',
    });
  }
}

module.exports = {
  verifyCredentials,
};
