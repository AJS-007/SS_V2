const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const { isLoggedIn, isSeller } = require('../middleware/authMiddleware');
const Order = require('../models/order');

router.get('/', isLoggedIn, isSeller, sellerController.showSellerHub);
router.post('/create', isLoggedIn, isSeller, sellerController.createSeller);

// Dispatch order route
router.post('/orders/:orderId/dispatch', isLoggedIn, isSeller, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    await Order.findByIdAndUpdate(orderId, { status: 'Delivered', deliveredAt: new Date() });
    res.redirect('/seller'); // Adjust if your seller hub route is different
  } catch (err) {
    console.error(err);
    res.status(500).send('Error dispatching order');
  }
});

module.exports = router;
