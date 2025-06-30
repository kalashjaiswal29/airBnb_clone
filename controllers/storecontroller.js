const Home = require("../Models/home");
const User = require("../Models/user");
const path = require("path") ;
const rootdir = require('../Utils/utils')

exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("Store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "airBnB Home",
      currPage: "home",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getIndex = (req, res, next) => {
  console.log("Session at", req.session.isLoggedIn);
  Home.find()
    .then((registeredHomes) => {
      res.render("Store/index", {
        registeredHomes: registeredHomes,
        pageTitle: "Index",
        currPage: "index",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    })
    .catch((err) => {
      console.log("Error while rendering index", err);
    });
};

//Get add home

exports.getBookings = (req, res, next) => {
  res.render("Store/bookings", {
    pageTitle: "My Bookings",
    currPage: "bookings",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.getFavourateList = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate("favourates");
  res.render("Store/fav-homes", {
    pageTitle: "My Favourates",
    currPage: "favourates",
    favourateHomes: user.favourates,
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.getHomeDetail = (req, res, next) => {
  const houseId = req.params.houseId;
  Home.findById(houseId).then((home) => {
    if (!home) {
      res.redirect("/homes");
    } else {
      console.log("Details for house id:", houseId);
      res.render("Store/home-details", {
        pageTitle: "Home datail",
        currPage: ["home:", houseId],
        home: home,
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    }
  });
};

exports.postAddtoFavourates = async (req, res, next) => {
  console.log("user 1", req.session.user);
  const homeid = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  console.log(user);
  if (!user.favourates.includes(homeid)) {
    user.favourates.push(homeid);
    await user.save();
    console.log("user ", user);
  }
  res.redirect("/homes");
};

exports.postRemoveFavourate = async (req, res, next) => {
  const homeid = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (user.favourates.includes(homeid)) {
    user.favourates = user.favourates.filter((fav) => fav != homeid);
    await user.save();
  }
  res.redirect("/homes");
};

exports.getHomeRules = [
  (req, res, next) => {
    if (!req.session.isLoggedIn) {
      return res.redirect("/login");
    } else {
      next();
    }
  },
  (req,res,next) => {
    const homeId = req.params.homeId ;
    const rulesfileName = 'house rules.pdf' ;
    const filePath = path.join(rootdir,'rules',rulesfileName) ;
    res.download(filePath, 'rules.pdf')
  }
];
