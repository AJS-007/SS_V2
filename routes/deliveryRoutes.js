const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

router.get('/', deliveryController.showDelivery);
router.post('/', deliveryController.calculateDelivery);

module.exports = router;
