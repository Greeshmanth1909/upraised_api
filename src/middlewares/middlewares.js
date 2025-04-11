const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;
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