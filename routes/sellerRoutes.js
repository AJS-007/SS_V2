const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const { isLoggedIn, isSeller} = require('../middleware/authMiddleware');


router.get('/', isLoggedIn, isSeller, sellerController.showSellerHub);
router.post('/create', isLoggedIn, isSeller, sellerController.createSeller);

module.exports = router;
