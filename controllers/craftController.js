const Craft = require('../models/craft');
const Seller = require('../models/seller');

// list crafts, optional ?state=Karnataka
exports.listCrafts = async (req, res) => {
  const filter = {};
  if (req.query.state) filter.originState = req.query.state;
  try {
    const crafts = await Craft.find(filter).populate('seller').sort({ createdAt: -1 });
    // get distinct states for filter dropdown
    const states = await Craft.distinct('originState');
    res.render('marketplace', { crafts, states, selectedState: req.query.state || '' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.showCraftDetail = async (req, res) => {
  try {
    const craft = await Craft.findById(req.params.id).populate('seller');
    if (!craft) return res.status(404).send('Not found');
    res.render('craftDetail', { craft });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// create craft (multipart via multer)
exports.createCraft = async (req, res) => {
  try {
    const { name, description, category, price, originState, weightKg, sellerId } = req.body;
    // images saved by multer in req.files
    const imagePaths = (req.files || []).map(f => '/uploads/' + f.filename);
    const craft = new Craft({
      name, description, category, price, images: imagePaths, originState, weightKg,
      seller: sellerId
    });
    await craft.save();
    res.redirect('/marketplace');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating craft');
  }
};
