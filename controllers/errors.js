exports.pageNotFound=(req,res)=>{
    // res.status(404).sendFile(path.join(rootDir,'views','404.html'));
    res.render('404',{pageTitle: 'Page Not Found', isLoggedIn:req.isLoggedIn,user:req.session.user});
}