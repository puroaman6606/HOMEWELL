// const  Favourite  = require('../models/favourite');
const User=require('../models/user');
const mongoose=require('mongoose')
const  Home  = require('../models/home');  // importing Home class

exports.getHomes=(req,res,next)=>{
    Home.find().then(registeredHomes=>{
        // console.log("Registered Homes:", registeredHomes);
        res.render('store/homeList',{registeredHomes: registeredHomes,pageTitle: 'Homes List',isLoggedIn:req.isLoggedIn,user:req.session.user});
    });
  
}


// exports.getBookings=(req,res,next)=>{
//     res.render('store/bookings',{pageTitle: 'Your Bookings', isLoggedIn:req.isLoggedIn,user:req.session.user});
// }


exports.getFavouriteList= async (req,res,next)=>{
     const userId=req.session.user.userId;
     const user= await User.findById(userId).populate('favourites')          
        res.render('store/favouriteList',{favouriteHomes: user.favourites ,pageTitle: 'Favourites List', isLoggedIn:req.isLoggedIn,user:req.session.user});
}
exports.postFavouriteList= async (req,res,next)=>{
    const homeId=req.body.homeId;
    const userId=req.session.user.userId;
    const user= await User.findById(userId);
    if(user.favourites.includes(homeId)){
        res.redirect("/favourite-list")
    }
    else{
    user.favourites.push(homeId);
    await user.save();
    return res.redirect("/favourite-list");
    }

}
exports.postRemoveFavourite=(req,res,next)=>{
    const home_Id=req.params.home_Id;
     const userId=req.session.user.userId;
      User.findByIdAndUpdate( userId, { $pull: { favourites: home_Id } }).then(()=>{
            res.redirect('/favourite-list');
    }).catch(err=>{
        console.log("Error while deleting",err);
    })
}
exports.getIndex=(req,res,next)=>{
     Home.find().then(registeredHomes=>{        
        res.render('store/index',{registeredHomes: registeredHomes ,pageTitle: 'Airbnb Home', isLoggedIn:req.isLoggedIn,user:req.session.user});
    });
}

exports.getHomeDetails=(req,res,next)=>{
    const home_Id=req.params.home_Id; // Extract homeId from URL parameters
    console.log("Requested Home ID:", home_Id);
    Home.findById(home_Id).then(homefound =>{       //homefound is the home object returned by findById method
        if(!homefound){
            (console.log("Home not found with ID:", home_Id));
            res.redirect('/');
        }
        else{
        console.log("Home Found:", homefound);
    res.render('store/homeDetails',{home_Id:home_Id,pageTitle:'Home Details', home:homefound, isLoggedIn:req.isLoggedIn,user:req.session.user});
        }
    });

}



