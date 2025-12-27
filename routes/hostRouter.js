const express = require('express');
const path = require('path');
const hostRouter = express.Router();      // router for host-related routess
const rootDir = require('../utils/pathUtil');
const { get } = require('http');
const { getAddHome, getHostHomes } = require('../controllers/hostController');
const { postAddHome } = require('../controllers/hostController');
// const {getHostHomes}=require('../controllers/hostController');
const { getEditHome } = require('../controllers/hostController');
const { postEditHome } = require('../controllers/hostController');
const { post } = require('./storeRouter');
const { postDeleteHome } = require('../controllers/hostController');
const upload=require('../middlewares/upload');
const {isAuth}=require('../middlewares/isAuth');
const {isHost}=require('../middlewares/isHost');

hostRouter.get("/add-home",isAuth,isHost,getAddHome);
hostRouter.post("/add-home",isAuth,isHost,upload.single('photoUrl'),postAddHome);
hostRouter.get("/host-homes",isAuth,isHost,getHostHomes);

hostRouter.get("/editHome/:home_Id",isAuth,isHost,getEditHome);
hostRouter.post("/editHome",isAuth,isHost,upload.single('photoUrl'),postEditHome);
hostRouter.post("/deleteHome/:home_Id",isAuth,isHost,postDeleteHome);
exports.hostRouter=hostRouter;
