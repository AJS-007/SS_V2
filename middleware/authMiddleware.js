exports.ensureAuth = (req, res, next) => {
  if (req.session && req.session.user) return next();
  return res.redirect('/auth/login');
};

exports.ensureGuest = (req, res, next) => {
  if (!req.session.user) return next();
  return res.redirect('/auth/dashboard');
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    const user = req.session.user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).send('Access denied: Unauthorized');
    }
    next();
  };
};



// middleware/authMiddleware.js
//Cheak if user is login
exports.isLoggedIn = (req, res, next) => {
  const user = req.session.user;

  if (!user) {
    // Not logged in
    return res.redirect('/auth/login');
  }

  // ✅ User is a seller → continue to controller
  next();
};


exports.isSeller = (req, res, next) => {
  const user = req.session.user;

  if (req.session && user && user.role !== 'seller') {
    // Logged in but not a seller
    return res.status(403).send('Access denied: Sellers only');
  }

  // ✅ User is a seller → continue to controller
  next();
};

