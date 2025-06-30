
//External module
const express = require("express");
const multer = require('multer') ;
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
db_url =
  "mongodb+srv://root:6467kalash**999@kalash.ejfmkg2.mongodb.net/airbnb?retryWrites=true&w=majority&appName=Kalash";

//Local modules
const storeRouter = require("./routes/storeRouter");
const { hostRouter } = require("./routes/hostRouter");
const { authRouter } = require("./routes/authRouter");
const rootPath = require("./Utils/utils");
const { error } = require("./controllers/404");

const app = express();



app.set("view engine", "ejs");
app.set("views", "views");

const store = new MongoStore({
  uri: db_url,
  collection: "Sessions",
});

const randomString = (length) =>{
  const characters = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
  
    return result;
}

const storage = multer.diskStorage({
  destination : (req,res,cb)=>{
    cb(null,'uploads/') ;
  },
  filename : (req,file,cb)=>{
    cb(null , randomString(10)+"-"+file.originalname)
  }
})

const fileFilter = (req,file,cb)=>{
  if(['image/jpg','image/jpeg','image/png'].includes(file.mimetype)){
    cb(null,true)
  }else{
    cb(null,false);
  }
}

app.use(express.urlencoded());  
app.use(multer({storage,fileFilter}).single('photo')) ;
//Setting EJS
app.use(express.static(path.join(rootPath, "public")));
app.use('/uploads',express.static(path.join(rootPath, "uploads")));
app.use('/host/uploads',express.static(path.join(rootPath, "uploads")));
app.use('/homes/uploads',express.static(path.join(rootPath, "uploads")));


app.use(
  session({
    secret: "Kalash Jaiswal",
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);

app.use((req, res, next) => {
  console.log("Cookie came successfully", req.get("Cookie")),
    // req.isLoggedIn = req.get('Cookie') ? req.get('Cookie').split('=')[1] === 'true' : false  // [1] => first index
    (req.isLoggedIn = req.session.isLoggedIn);
  next();
});

app.use(authRouter);
app.use(storeRouter);
app.use("/host", (req, res, next) => {
  if (!req.isLoggedIn) {
    return res.redirect("/login");
  } else {
    next();
  }
});
app.use("/host", hostRouter); //this brings only those routes which has /host in it and further are matched in it

//comes to below only when none of the above / link is found
app.use(error);

//Server ready to get requests

const PORT = 3008;

// Reverse the below code

mongoose
  .connect(db_url)
  .then(() => {
    console.log("Connected to mongodb");
    app.listen(PORT, () => {
      console.log(`Server live at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error while connecting", err);
  });

//Delete after data connection retrives
//start delete
// mongoose.connect(db_url).then(()=>{
//   console.log("Connected to mongodb")

// }).catch((err)=>{
//   console.log("Error while connecting",err) ;
//   app.listen(PORT,()=>{
//     console.log(`Server live at http://localhost:${PORT}`) ;
//   })

// })

// app.listen(PORT,()=>{
//   console.log(`Server live at http://localhost:${PORT}`) ;
// })

//End delete
