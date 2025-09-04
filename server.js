require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const connectDB = require('./config/db');
const expressLayouts = require("express-ejs-layouts");

connectDB();

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);   // ✅ enable layouts
app.set("layout", "layout"); // ✅ default layout file

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

// static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', require('./routes/indexRoutes'));
app.use('/marketplace', require('./routes/craftRoutes'));
app.use('/seller', require('./routes/sellerRoutes'));
app.use('/ai', require('./routes/aiRoutes'));
app.use('/delivery', require('./routes/deliveryRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
