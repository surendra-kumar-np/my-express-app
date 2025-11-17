const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Expect Bearer TOKEN
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach logged-in user info
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};