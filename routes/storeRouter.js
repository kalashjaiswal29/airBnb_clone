//External module
const express = require("express");
const storeRouter = express.Router();
// const path = require('path')

const { getHomes } = require("../controllers/storecontroller");
const { getBookings } = require("../controllers/storecontroller");
const { getFavourateList } = require("../controllers/storecontroller");
const { getIndex } = require("../controllers/storecontroller");
const { getHomeDetail } = require("../controllers/storecontroller");
const { postAddtoFavourates } = require("../controllers/storecontroller");
const { postRemoveFavourate } = require("../controllers/storecontroller");
const { getHomeRules } = require("../controllers/storecontroller");
//Local Modules
// const rootPath = require('../Utils/utils')

storeRouter.get("/", getIndex);

storeRouter.get("/homes", getHomes);

storeRouter.get("/bookings", getBookings);

storeRouter.get("/favourates", getFavourateList);

storeRouter.get("/homes/:houseId", getHomeDetail);

storeRouter.post("/favourates", postAddtoFavourates);

storeRouter.post("/remove-favouate", postRemoveFavourate);

storeRouter.get("/rules/:houseId", getHomeRules);

module.exports = storeRouter;
