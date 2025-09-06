const User = require('../models/userModel');
const Craft = require('../models/craft');
const Seller = require('../models/seller');

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

  //req.session.user = user;       //

  let sellerData = null;
  if (user.role === 'seller') {
    sellerData = await Seller.findById(user._id).lean();  // Match seller _id to user _id
  }

  // Store only minimal user info (excluding password) + seller info if any
  req.session.user = {
    _id: user._id,
    username: user.username,
    role: user.role,
    sellerInfo: sellerData || null
  };



  res.redirect('/auth/dashboard');
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
};

// GET Dashboard (example protected page)
exports.getDashboard = async (req, res) => {
  const user = req.session.user;
  
  if(req.session.user.role === "user"){
    console.log("user");
    res.render('userDashboard', { user});
  }
  else if(user.role === "seller"){
    console.log("seller");

    // fetch crafts by seller id = user._id
    const crafts = await Craft.find({ seller: user._id }).lean();

    // fetch seller info by user._id
    const sellerInfo = await Seller.findById(user._id).lean();

    res.render('sellerDashboard', { user, seller: sellerInfo, crafts  });
  }
  else if(req.session.user.role === "admin"){
    console.log("admin");
    res.render('adminDashboard', { user});
  }
  //res.render('dashboard', { user: req.session.user });
};
