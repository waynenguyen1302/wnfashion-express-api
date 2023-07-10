// Middleware to check if the user is authenticated
exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    // User is not authenticated, redirect or return an error response
    res.status(401).json({ error: 'Unauthorized' });
  };
  
  // Middleware to check if the user is an admin
  exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      return next();
    }
    // User is not an admin, return an error response
    res.status(403).json({ error: 'Access restricted to admin users' });
  };