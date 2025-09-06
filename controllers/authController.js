const User = require('../models/userModel');
const Craft = require('../models/craft');
const Seller = require('../models/seller');
const Order = require('../models/order');


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

  if (user.role === "user") {
    try {
      // Fetch orders with craft info for logged-in user
      const orders = await Order.find({ buyer: user._id })
        .populate('craft')
        .sort({ createdAt: -1 })
        .lean();

      // Calculate if orders are delivered (3 days passed)
      const now = new Date();
      orders.forEach(order => {
        const daysSinceOrder = (now - new Date(order.createdAt)) / (1000 * 60 * 60 * 24);
        order.isDelivered = daysSinceOrder >= 3;
      });

      // Render userDashboard with orders data
      return res.render('userDashboard', { user, orders });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Error loading dashboard");
    }
  } 
  else if (user.role === "seller") {
    // Existing seller dashboard logic
    const crafts = await Craft.find({ seller: user._id }).lean();
    const sellerInfo = await Seller.findById(user._id).lean();
    return res.render('sellerDashboard', { user, seller: sellerInfo, crafts });
  } 
  else if (user.role === "admin") {
    // Existing admin dashboard logic
    return res.render('adminDashboard', { user });
  }
};


// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.session.user._id;

    const order = await Order.findOne({ _id: orderId, buyer: userId });
    if (!order) return res.status(404).send("Order not found");

    if (order.status === 'Cancelled') {
      return res.status(400).send("Order already cancelled");
    }

    order.status = 'Cancelled';
    await order.save();

    res.redirect('/auth/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error cancelling order");
  }
};

// Render edit order form
exports.editOrderForm = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.session.user._id;

    const order = await Order.findOne({ _id: orderId, buyer: userId }).populate('craft').lean();
    if (!order) return res.status(404).send("Order not found");

    res.render('editOrderForm', { order });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading order edit form");
  }
};

// Process order update
exports.updateOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.session.user._id;
    const { quantity } = req.body;

    const order = await Order.findOne({ _id: orderId, buyer: userId });
    if (!order) return res.status(404).send("Order not found");

    if (order.status === 'Cancelled') {
      return res.status(400).send("Cannot edit cancelled order");
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).send("Invalid quantity");
    }

    order.quantity = qty;
    order.totalPrice = order.craft.price * qty; // Make sure craft is populated or fetch price separately
    await order.save();

    res.redirect('/auth/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating order");
  }
};

