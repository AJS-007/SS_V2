const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const { ensureAuth, restrictTo } = require('../middleware/authMiddleware');

// Public Routes
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);



router.post('/dashboard/orders/:orderId/cancel', authController.cancelOrder);
router.get('/dashboard/orders/:orderId/edit', authController.editOrderForm);
router.post('/dashboard/orders/:orderId/edit', authController.updateOrder);



// Protected Routes
router.get('/logout', ensureAuth, authController.logout);
router.get('/dashboard', ensureAuth, authController.getDashboard);

// Example of role-based restriction
router.get('/admin-only', ensureAuth, restrictTo('admin'), (req, res) => {
  res.send('Welcome admin!');
});

module.exports = router;
