const express = require('express');
const router = express.Router();
const craftController = require('../controllers/craftController');
const multer = require('multer');

// setup multer storage into public/uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb){ cb(null, 'public/uploads') },
  filename: function(req, file, cb){ cb(null, Date.now() + '-' + file.originalname) }
});
const upload = multer({ storage });

router.get('/', craftController.listCrafts);
router.get('/new', async (req, res) => { /* you can render a "new craft" form with list of sellers */ });
router.get('/:id', craftController.showCraftDetail);
router.post('/create', upload.array('images', 4), craftController.createCraft);

module.exports = router;
