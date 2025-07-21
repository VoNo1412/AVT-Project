const jwt = require('jsonwebtoken');

const authMiddleware = (roles) => (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!roles.includes(decoded.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;