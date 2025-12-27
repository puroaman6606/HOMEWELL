
exports.isAuth = (req, res, next) => {
  // 1. Check if session exists and user is logged in
  if (!req.session || !req.session.isLoggedIn) {
    return res.redirect('/login');
  }

  // 2. Attach user info to req.user (VERY IMPORTANT)
  req.user= {
    userId: req.session.user.userId,
    role: req.session.user.role
  };

  // 3. Allow request to continue
  next();
};
