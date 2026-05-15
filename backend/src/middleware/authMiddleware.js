const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // Check if token exists in cookies or Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Anda belum login, silakan login untuk mengakses halaman ini.'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user info to request
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Token tidak valid atau sudah kedaluwarsa, silakan login kembali.'
    });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Anda tidak memiliki izin untuk melakukan tindakan ini.'
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };
