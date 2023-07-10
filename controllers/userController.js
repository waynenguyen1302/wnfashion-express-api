const User = require('../models/user')
const passport = require('passport')


//REGISTER
exports.createUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({
      username,
      email,
      password,
    });

    // Save the user to the database
    const createdUser = await newUser.save();

    // Log in the user
    req.logIn(createdUser, (err) => {
      if (err) {
        return next(err);
      }
      // User registration successful
      return res.status(201).json({ message: 'User registered successfully' });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//LOGIN
exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
      if (err) {
          return next(err);
      }
      if (!user) {
          return res.status(401).json({ error: info.message });
      }
      req.logIn(user, (err) => {
          if (err) {
              return next(err);
          }
          // User login successful
          return res.json({ message: 'User logged in successfully' });
      });
  })(req, res, next);
};

// LOGOUT
exports.logout = (req, res) => {
  req.logout(); // Assuming you're using passport.js for authentication
  res.redirect('/login'); // Redirect to the login page after logout
};

//ADMIN check
exports.isAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
      return next();
  }
  res.status(403).json({ error: 'Access restricted to admin users' });
};


// Get user by ID
exports.getUserById = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findOne(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  
// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
  
// Edit user
exports.editUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, img, isAdmin } = req.body;
  
    const updatedUser = await User.findOneAndUpdate(
      userId,
      { username, email, img, isAdmin },
      { new: true }
    );
  
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    return res.json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
  
// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
  
    const deletedUser = await User.findOneAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};