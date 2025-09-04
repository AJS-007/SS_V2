const User = require('../models/userModel');

// GET Signup form
exports.getSignup = (req, res) => {
  res.render('auth/signup');
};

// POST Signup
exports.postSignup = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = await User.create({ username, password, role });
    req.session.user = user;
    res.redirect('/auth/dashboard');
  } catch (err) {
    res.send('Signup error: ' + err.message);
  }
};

// GET Login form
exports.getLogin = (req, res) => {
  res.render('auth/login');
};

// POST Login
exports.postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await user.comparePassword(password))) {
    return res.send('Invalid credentials');
  }

  req.session.user = user;
  res.redirect('/auth/dashboard');
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
};

// GET Dashboard (example protected page)
exports.getDashboard = (req, res) => {
  res.render('dashboard', { user: req.session.user });
};
