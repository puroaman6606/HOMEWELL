const  Home  = require('../models/home');  // importing Home class
const mongoose=require('mongoose');
const fs=require('fs')
const path=require('path')
// for rendering add home form (seller)
exports.getAddHome=(req,res,next)=>{
    // console.lg(req.body);
    // res.sendFile(path.join(rootDir,'views','addHome.html'));
    res.render('host/editHome',{pageTitle: 'Add New Home' ,isLoggedIn:req.isLoggedIn, editing: false,user:req.session.user});
}

exports.getEditHome=(req,res,next)=>{
    const home_Id=req.params.home_Id;
    const editMode=req.query.editing==='true';
    // console.log("Edit Home ID:", homeId," Edit Mode:", editMode);
    Home.findOne({ _id: home_Id,  hostId: req.user.userId}).then(homefound=>{        
        if(!homefound){
            (console.log("Home not found with ID:", home_Id));
            return res.redirect('/host-homes');
        }
        // console.log("Home Found for Editing:", homefound);
     res.render('host/editHome',{pageTitle: 'Edit your Home' , editing: editMode, homefound: homefound,isLoggedIn:req.isLoggedIn,user:req.session.user});
}
    );
}


exports.postEditHome = (req, res, next) => {
  const { houseName, rent, location } = req.body;
  const homeId = req.body._id;

  // 🔒 Find home ONLY if it belongs to this host
  Home.findOne({_id: homeId,hostId: req.user.userId
  })
    .then(hom => {
      if (!hom) {
        // Either home doesn't exist OR not owned by this host
        return res.redirect('/host/host-homes');
      }

      // Update fields
      hom.houseName = houseName;
      hom.rent = rent;
      hom.location = location;

      // Handle image update
      if (req.file) {
        const oldPath = path.join('public', hom.photoUrl);

        fs.unlink(oldPath, err => {
          if (err) {
            console.log('Error deleting old photo:', err);
          }
        });

        hom.photoUrl = 'uploads/' + req.file.filename;
      }

      return hom.save();
    })
    .then(() => {
      res.redirect('/host/host-homes');
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Something went wrong');
    });
};

exports.postAddHome=(req,res,next)=>{
    const { houseName, rent, location } = req.body;

    // 🔑 multer se aayi file
   if (!req.file) {
    return res.status(400).send("No image provided");
}
const photoUrl = 'uploads/' + req.file.filename;
   const hom= new Home({houseName,rent,location,photoUrl,hostId: req.user.userId})
   hom.save().then(result=>{
    res.redirect('/host/host-homes');
   })
}

exports.getHostHomes=(req,res,next)=>{
     Home.find({hostId: req.user.userId}).then(registeredHomes=>{
        // console.log("Registered Homes:", registeredHomes);
        res.render('host/host-homeList',{registeredHomes: registeredHomes ,pageTitle: 'Host Homes List', isLoggedIn:req.isLoggedIn,user:req.session.user});
    });
}

exports.postDeleteHome=(req,res,next)=>{
    const home_Id=req.params.home_Id;
    Home.findOneAndDelete({_id: home_Id,hostId: req.user.userId }).then(()=>{
            res.redirect('/host/host-homes');
    }).catch(err=>{
        console.log("Error while deleting",err);
    })
}