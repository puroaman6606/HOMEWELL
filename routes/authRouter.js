const express=require('express');
const authRouter=express.Router();
const {getLogin}=require('../controllers/authController');
const {postLogin}=require('../controllers/authController')
const {postLogout}=require('../controllers/authController')
const {getLogout}=require('../controllers/authController');
const {getSignup}=require('../controllers/authController');
const {postSignup}=require('../controllers/authController');
const {isGuest}=require('../middlewares/isGuest');


authRouter.get("/login",isGuest, getLogin);
authRouter.post("/login",postLogin);
authRouter.post('/logout',postLogout);
authRouter.get('/logout',getLogout);
authRouter.get('/signup',isGuest,getSignup);
authRouter.post('/signup',postSignup);

module.exports=authRouter;