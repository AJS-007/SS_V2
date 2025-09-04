exports.showDelivery = (req, res) => {
  res.render('delivery', { quote: null });
};

exports.calculateDelivery = (req, res) => {
  const { fromPin, toPin, weight } = req.body;
  const p1 = (fromPin || '').toString().replace(/\D/g,'');
  const p2 = (toPin || '').toString().replace(/\D/g,'');
  if (p1.length < 6 || p2.length < 6) {
    return res.render('delivery', { quote: { error: 'Enter valid 6-digit pincodes' }});
  }
  const zone = Math.abs(parseInt(p1.slice(0,2)) - parseInt(p2.slice(0,2)));
  const w = Math.max(0.25, parseFloat(weight) || 0.5);
  const base = 60;
  const perKg = 45;
  const zoneFee = Math.min(250, zone * 12);
  const cost = Math.round(base + perKg * w + zoneFee);
  const etaDays = Math.min(10, 2 + Math.ceil(zone / 3));
  res.render('delivery', { quote: { cost, etaDays, carrier: zone > 12 ? 'India Post' : 'Regional Courier' }});
};
