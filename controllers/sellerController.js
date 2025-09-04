const Seller = require('../models/seller');

exports.showSellerHub = (req, res) => {
  res.render('sellerHub', { message: null });
};

exports.createSeller = async (req, res) => {
  try {
    const { name, village, state, pincode, phone, bio } = req.body;
    const seller = new Seller({ name, village, state, pincode, phone, bio });
    await seller.save();
    // after seller created, redirect to sellerHub with message or to add craft form
    res.render('sellerHub', { message: 'Seller registered. Note Seller ID: ' + seller._id, seller });
  } catch (err) {
    console.error(err);
    res.render('sellerHub', { message: 'Error creating seller' });
  }
};
