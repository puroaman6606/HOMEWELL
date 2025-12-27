// require('dotenv').config();
// const express=require('express');
// const session=require('express-session');
// // const MongoDBStore=require('connect-mongodb-session')(session);
// const MongoStore = require('connect-mongo').default;
// const path=require('path');
// const storeRouter=require('./routes/storeRouter');
// const {hostRouter}=require('./routes/hostRouter');
// const rootDir=require('./utils/pathUtil');
// const {pageNotFound}=require('./controllers/errors');
// // const { mongoConnect } = require('./utils/dbUtil');
// const { default: mongoose}=require ('mongoose');
// const authRouter=require('./routes/authRouter');

// console.log(MongoStore);


// const app=express();
// app.set('view engine','ejs');  //setting EJS as the templating engine
// app.set('views','views');

// // const dbPath='mongodb+srv://aman482004:aman48@cluster0.xewa0av.mongodb.net/AirBnB?appName=Cluster0'
// const store= MongoStore.create({
//     mongoUrl:process.env.MONGO_URI,
//     collectionName:'sessionsv2'
// })

// app.use(express.urlencoded({extended:true}));       //parses client data from form submissions(urlencoded data) and makes it available under req.body

// app.use(express.static(path.join(rootDir,'public')));  //serves static files from 'public' directory

// app.use(session({
//     secret:process.env.SESSION_SECRET,
//     resave:false,
//     saveUninitialized:true,
//     store
// }));
// app.use((req,res,next)=>{
//     req.isLoggedIn=req.session.isLoggedIn;
//     next();
//  })
 
// app.use(authRouter);
// app.use(storeRouter); //middleware to handle user-related routes

// app.use("/host", hostRouter); //middleware to handle host-related routes

// app.use(pageNotFound);  //middleware to handle 404 errors

// const PORT=process.env.PORT || 3000;
// mongoose.connect(process.env.MONGO_URI).then(()=>{
//     console.log("Connected to Mongo");
// app.listen(PORT,()=>{
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
// }).catch(err=>{
//     console.log("Error while connecting Mongo:", err);
// })





require("dotenv").config();

const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const path = require("path");
const mongoose = require("mongoose");

const storeRouter = require("./routes/storeRouter");
const { hostRouter } = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const rootDir = require("./utils/pathUtil");
const { pageNotFound } = require("./controllers/errors");

const app = express();

// view engine
app.set("view engine", "ejs");
app.set("views", "views");

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, "public")));

// ---- CONNECT DB FIRST ----
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // ✅ create session store AFTER DB connection
    const store = MongoStore.create({
      client: mongoose.connection.getClient(),
      collectionName: "sessionsv2",
    });

    app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store,
      })
    );

    // auth helper
    app.use((req, res, next) => {
      req.isLoggedIn = req.session.isLoggedIn;
      next();
    });

    // routes
    app.use(authRouter);
    app.use(storeRouter);
    app.use("/host", hostRouter);
    app.use(pageNotFound);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
