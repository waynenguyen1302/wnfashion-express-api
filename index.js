const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
var cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./models/user');

var corsOptions = {
  origin: process.env.clientURL
};

app.use(cors(corsOptions));
app.use(cors({ origin: ['http://localhost:4000', 'http://localhost:3000'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to DB
let userName = process.env.DB_USERNAME;
let password = process.env.DB_PASSWORD;
let connectionString = `mongodb+srv://${userName}:${password}@cluster0.t7cyadi.mongodb.net/?retryWrites=true&w=majority`;

// PASSPORT
// Configure session middleware
app.use(cookieParser());
app.use(
  session({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: connectionString })
  })
);
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure the local strategy for username/password authentication
passport.use(
  'local',
  new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => {
    try {
      // Find the user by username
      const user = await User.findOne({ username });

      // If the user does not exist or the password is incorrect, return error
      if (!user || !(await user.comparePassword(password))) {
        return done(null, false, { message: 'Invalid username or password' });
      }

      // If authentication is successful, return the user
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Serialize the user object to store in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize the user object from the session
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});

const categoryRouter = require('./routes/categories');
const productRouter = require('./routes/products');
const usersRouter = require('./routes/users');
const orderRouter = require('./routes/orders');

app.get("/", (req, res) => {
  res.send("Hello first request");
});

// Setup Router
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/users', usersRouter);
app.use('/api/orders', orderRouter);



mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected successfully!');
  })
  .catch((error) => {
    console.log(`Error while connecting! ${error}`);
});

// Set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
