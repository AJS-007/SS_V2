const mongoose = require('mongoose');
const Seller = require('../models/seller');
const Craft = require('../models/craft');
const Order = require('../models/order');

exports.showSellerHub = async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.session.user._id);

    // Get crafts of this seller
    const crafts = await Craft.find({ seller: sellerId }).lean();
    const craftIds = crafts.map(craft => craft._id);

    // Get all orders for these crafts
    const allOrders = await Order.find({ craft: { $in: craftIds } })
      .populate('craft')
      .lean();

    // Separate pending and completed orders
    const pendingOrders = allOrders.filter(order => !order.isCompleted);
    const completedOrders = allOrders.filter(order => order.isCompleted);

    // Group orders by craft
    const ordersByCraft = crafts.map(craft => ({
      craft,
      orders: allOrders.filter(order => order.craft._id.toString() === craft._id.toString())
    }));

    res.render('sellerHub', {
      crafts,
      orders: allOrders,
      ordersByCraft,
      pendingOrders,
      completedOrders,
      message: null
    });
  } catch (error) {
    console.error(error);
    res.render('sellerHub', {
      crafts: [],
      orders: [],
      ordersByCraft: [],
      pendingOrders: [],
      completedOrders: [],
      message: 'Error loading seller hub'
    });
  }
};

exports.createSeller = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { name, village, state, pincode, phone, bio } = req.body;
    const seller = new Seller({ _id: userId, name, village, state, pincode, phone, bio });
    await seller.save();

    res.render('sellerHub', { message: 'Seller registered. Note Seller ID: ' + seller._id, crafts: [], ordersByCraft: [], pendingOrders: [], completedOrders: [], user: req.session.user });
  } catch (err) {
    console.error(err);
    res.render('sellerHub', { message: 'Error creating seller', crafts: [], ordersByCraft: [], pendingOrders: [], completedOrders: [], user: req.session.user });
  }
};
