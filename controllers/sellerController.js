const Seller = require('../models/seller');
const User = require('../models/userModel');


exports.showSellerHub = (req, res) => {
  
  res.render('sellerHub', { message: null });
};

exports.createSeller = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { name, village, state, pincode, phone, bio } = req.body;
    const seller = new Seller({ _id: userId, name, village, state, pincode, phone, bio });
    //const user = new User({role, _id});


    await seller.save();
    // after seller created, redirect to sellerHub with message or to add craft form
    res.render('sellerHub', { message: 'Seller registered. Note Seller ID: ' + seller._id, seller });
  } catch (err) {
    console.error(err);
    res.render('sellerHub', { message: 'Error creating seller' });
  }
};
