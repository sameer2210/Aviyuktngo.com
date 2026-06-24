const jwt = require('jsonwebtoken');

// Check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Please login first' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Check if user is admin (you'll need to add isAdmin field to user model)
exports.isAdmin = (req, res, next) => {
  try {
    if (req.user?.isAdmin || req.user?.email === process.env.ADMIN_EMAIL) {
      next();
    } else {
      res.status(403).json({ error: 'Access denied. Admin only.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
