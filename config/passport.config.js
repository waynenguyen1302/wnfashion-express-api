const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const newLocal = '../models/user';
const User = require(newLocal);

// Configure the local strategy for username/password authentication
passport.use(
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

// Configure the JWT strategy for token authentication
passport.use(
  new JwtStrategy(
    {
      secretOrKey: 'your-secret-key',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (jwtPayload, done) => {
      try {
        // Find the user by ID from the JWT payload
        const user = await User.findById(jwtPayload.userId);

        // If the user does not exist, return error
        if (!user) {
          return done(null, false, { message: 'Invalid token' });
        }

        // If authentication is successful, return the user
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Generate a JWT token
const generateJWT = (user) => {
  const payload = {
    userId: user._id,
  };

  return jwt.sign(payload, 'your-secret-key', { expiresIn: '1h' });
};

module.exports = { passport, generateJWT };


