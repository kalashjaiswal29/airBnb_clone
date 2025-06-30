//External module
const express = require("express");
// const path = require('path')

//Local module
const authRouter = express.Router();
// const rootPath = require('../Utils/utils')
const { getlogin } = require("../controllers/authcontroller");
const { postlogin } = require("../controllers/authcontroller");
const { postlogout } = require("../controllers/authcontroller");
const { postsignin } = require("../controllers/authcontroller");
const { getSignIn } = require("../controllers/authcontroller");

authRouter.get("/login", getlogin);
authRouter.post("/login", postlogin);
authRouter.post("/logout", postlogout);
authRouter.get("/signup", getSignIn);
authRouter.post("/signup", postsignin);

//Defining an array to store register homes

exports.authRouter = authRouter;
