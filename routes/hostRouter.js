//External module
const express = require("express");
// const path = require('path')

//Local module
const hostRouter = express.Router();
// const rootPath = require('../Utils/utils')
const { getHome } = require("../controllers/hostcontroller");
const { postAddHome } = require("../controllers/hostcontroller");
const { getHost_homeList } = require("../controllers/hostcontroller");
const { getEditHome } = require("../controllers/hostcontroller");
const { postEditHome } = require("../controllers/hostcontroller");
const { postDeleteHome } = require("../controllers/hostcontroller");

hostRouter.get("/add-home", getHome);

//Defining an array to store register homes

hostRouter.post("/add-home", postAddHome);

hostRouter.get("/Host-homeList", getHost_homeList);

hostRouter.get("/edit-home/:homeId", getEditHome);

hostRouter.post("/edit-home", postEditHome);

hostRouter.post("/delete-home", postDeleteHome);

exports.hostRouter = hostRouter;
