const express = require('express');
const storeRouter = express.Router();  // router for user-related routes
const path = require('path');
// const rootDir = require('../utils/pathUtil');
const { getHomes, postFavouriteList, postRemoveFavourite } = require('../controllers/storeController');
// const { getBookings } = require('../controllers/storeController');
const { getFavouriteList } = require('../controllers/storeController');
const { getIndex } = require('../controllers/storeController');
const { getHomeDetails } = require('../controllers/storeController');
const {isAuth}=require('../middlewares/isAuth');
const { postCreateBooking, getBookingDetails,getMyBookings, postCancelBooking } = require('../controllers/bookingsController');
const {getCheckout, postVerifyPayment}=require('../controllers/paymentController');

storeRouter.get("/", getIndex);
storeRouter.get("/bookings",isAuth, getMyBookings);
storeRouter.post("/bookings", isAuth,postCreateBooking);
storeRouter.get("/bookings/:bookingId",isAuth,getBookingDetails);
storeRouter.get("/payments/:bookingId",isAuth,getCheckout);
storeRouter.post("/payments/verify", isAuth,postVerifyPayment)
storeRouter.post('/bookings/:bookingId/cancel', isAuth,postCancelBooking);
// storeRouter.post("/bookings",isAuth, postBookings);
storeRouter.get("/favourite-list",isAuth, getFavouriteList);
storeRouter.get("/homes", isAuth,getHomes);

storeRouter.get("/homes/:home_Id",isAuth, getHomeDetails);
storeRouter.post("/favourite-list",isAuth, postFavouriteList);
storeRouter.post("/favourite-list/delete/:home_Id",isAuth,postRemoveFavourite);
module.exports = storeRouter;
