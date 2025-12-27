const { check, validationResult } = require('express-validator');
const User=require('../models/user');
const bcrypt=require('bcryptjs');
exports.getLogin=(req,res,next)=>{

     res.render('auth/login',{pageTitle: 'Login', isLoggedIn:false, errors:[],oldInput:{},user:{}});
}

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).render("auth/login", {
      pageTitle: 'Login',
      isLoggedIn: false,
      errors: ["user doesn't exist"],
      oldInput: { email },
      user: {}
    });
  }

  // 🔒 check if admin banned user (future-ready)
  if (user.isActive === false) {
    return res.status(403).render("auth/login", {
      pageTitle: 'Login',
      isLoggedIn: false,
      errors: ["Account is disabled"],
      oldInput: { email },
      user: {}
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(422).render("auth/login", {
      pageTitle: 'Login',
      isLoggedIn: false,
      errors: ["invalid password"],
      oldInput: { email },
      user: {}
    });
  }

  // ✅ STORE ONLY AUTH CONTEXT
  req.session.isLoggedIn = true;
  req.session.user = {
    userId: user._id.toString(),
    role: user.role   // guest / host / admin
    // fullname: user.fullname,
    // email: user.email
};

  req.session.save(err => {
    if (err) {
      console.log('SESSION SAVE ERROR:', err);
    }
    res.redirect('/');
  });
};

exports.getLogout=(req,res,next)=>{
    res.render('auth/logout', {pageTitle:'Logout', isLoggedIn:true,user:req.session.user});
}
exports.postLogout=(req,res,next)=>{
    req.session.destroy(()=>{
        res.redirect('/'); 
    });
    // req.session.isLoggedIn=false;
    // res.cookie("isLoggedIn",false);
 // res.redirect('/');
}


exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Signup',
    isLoggedIn: false,
    errors: [],
    oldInput: {},
    user:{}
  });
};

exports.postSignup = [

  check("fullname")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Full name should be at least 2 characters long")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Full name should contain only alphabets"),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters long")
    .matches(/(?=.*[A-Z])/)
    .withMessage("Password should contain at least one uppercase letter")
    .matches(/(?=.*[a-z])/)
    .withMessage("Password should contain at least one lowercase letter")
    .matches(/(?=.*[0-9])/)
    .withMessage("Password should contain at least one number")
    .matches(/(?=.*[\W_])/)
    .withMessage("Password should contain at least one special character")
    .trim(),

  check("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  check("usertype")
    .isIn(["guest", "host"])
    .withMessage("Please select a valid user type"),

  check("terms")
    .equals("on")
    .withMessage("Please accept the terms and conditions"),

  (req, res, next) => {
    const { fullname, email,password, usertype } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "Signup",
        isLoggedIn: false,
        errors: errors.array().map(err => err.msg),
        oldInput: { fullname, email, usertype, terms: req.body.terms },
        user:{}
        
      });
    }
    bcrypt.hash(password,12).then(hashedPassword=>{
    const user = new User({fullname,email,password: hashedPassword,role: usertype });

     user.save().then(()=>{
        res.redirect("/login");
    })
    
    }).catch((err)=>{
        console.log(err);
       return res.status(422).render("auth/signup", {
        pageTitle: "Signup",
        isLoggedIn: false,
        errors: ['something went wrong'],
        oldInput: { fullname, email,  usertype, terms: req.body.terms },
        user:{}
    });
});
  
  }
];
