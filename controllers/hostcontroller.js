const Home = require("../Models/home");
const User = require("../Models/user");
const fs = require('fs')
//Post add home

exports.postAddHome = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  console.log(user);
  const { houseName, price, location, rating, description } =
   await req.body;
    console.log( houseName, price, location, rating, description )
    console.log(req.file) ;
    if(!req.file){
      console.log("Image not provided.")
      res.redirect("/host/add-home")
    }
    const photo = req.file.path ;
  const home = new Home({
    houseName,
    price,
    location,
    rating,
    photo,
    description,
  });

  await home
    .save()
    .then(() => {
      console.log("Home saved successfully", home._id);
      user.hostHomes.push(home._id);
      return user.save();
    })
    .catch((err) => {
      console.log("Error occurred adding", err);
      res.redirect("/host/add-home");
    });
  res.redirect("/host/Host-homeList");
};

exports.getHome = (req, res, next) => {
  res.render("Host/edit-homes", {
    pageTitle: "Add Home to airbnb",
    currPage: "add-home",
    editing: false,
    isLoggedIn: req.isLoggedIn,
    home: {}, // avoid undefined error
    user: req.session.user,
  });
};

exports.getEditHome = (req, res, next) => {
  const homeid = req.params.homeId;
  const editing = req.query.editing === "true";
  Home.findById(homeid).then((home) => {
    if (!home) {
      console.log("Home not found with id", homeid);
      return res.redirect("/host/Host-homeList");
    } else {
      res.render("Host/edit-homes", {
        pageTitle: "Edit your Home",
        currPage: "add-home",
        editing: editing,
        home: home,
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    }
  });
};

exports.getHost_homeList = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate("hostHomes");

  res.render("Host/HostHomes-List", {
    registeredHomes: user.hostHomes ? user.hostHomes : [],
    pageTitle: "HostHome-List",
    currPage: "host-homeList",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

//postEditHome

exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, description } =
    req.body;
  Home.findById(id).then((home) => {
    home.houseName = houseName;
      home.price = price ;
      home.location = location ;
      home.rating = rating ;
      
      home.description = description ;
      if(req.file){
        fs.unlink(home.photo,(err)=>{
          console.log("error deleting previous uploads!")
        })
        home.photo = req.file.path ;
      };
      home
        .save()
        .then((result) => {
          console.log("Home Updated Successfully", result);
          res.redirect("/host/Host-homeList");
        })
        .catch((err) => {
          console.log("Error Occurred while Updating.", err);
        });
  });
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.body.id;
  console.log(homeId);
  Home.findByIdAndDelete(homeId)
    .then(() => {
      res.redirect("/host/Host-homeList");
    })
    .catch((err) => {
      console.error("Error deleting home:", err); // log the actual MySQL error
      res.status(500).send("Error deleting home");
    });
};
