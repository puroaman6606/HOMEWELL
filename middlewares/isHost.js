exports.isHost = (req, res, next) => {
  // req.user is already set by isAuth
    
  if (!req.user || req.user.role !== 'host') {
  console.log(req.user,req.user.role);
    return res.status(404).render('404', {
      pageTitle: 'Access Denied',
      message: 'Only hosts can access this page'
    });
  }

  next();
};
