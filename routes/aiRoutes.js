const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.get('/:id', aiController.getAiInfo);

module.exports = router;
