require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const connectDB = require('./config/db');
const expressLayouts = require("express-ejs-layouts");
const flash = require('connect-flash');

const session = require('express-session');
const MongoStore = require('connect-mongo');

connectDB();

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);   // ✅ enable layouts
app.set("layout", "layout"); // ✅ default layout file

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));



// ✅ Session middleware (required for auth)
app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSuperSecretKey',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/ss_v2',
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

// ✅ Make user session available in all views (like header.ejs)
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});


app.use(flash());

// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', require('./routes/indexRoutes'));
app.use('/marketplace', require('./routes/craftRoutes'));
app.use('/seller', require('./routes/sellerRoutes'));
app.use('/ai', require('./routes/aiRoutes'));
app.use('/delivery', require('./routes/deliveryRoutes'));
app.use('/auth', require('./routes/authRoutes')); // 🔐 Add this route for login/signup/logout

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
