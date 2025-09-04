const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');

router.get('/', sellerController.showSellerHub);
router.post('/create', sellerController.createSeller);

module.exports = router;
