const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

/**
 * Middleware to authenticate requests using JWT
 * @name authenticateUser
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 * 
 * @description
 * This middleware verifies the JWT token in the Authorization header.
 * If the token is valid, it allows the request to proceed.
 * If the token is invalid or missing, it returns a 401 Unauthorized response.
 */
function authenticateUser(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({
          status: 'fail',
          message: 'Unauthorized!',
        });
    }
    const token = authHeader.split(' ')[1];
    try {
      const user = jwt.verify(token, secret);
    //   req.user = user;
      next();
    } catch (error) {
      res.status(401).json({
          status: 'fail',
          message: 'Unauthorized!',
        });
    }
}

module.exports = {
    authenticateUser
}