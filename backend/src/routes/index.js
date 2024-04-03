const express = require("express");
const authRoute = require("./auth.route");
const userRoute = require("./users.route");
const solarSystemRoute = require("./solar-system.route");
const quadranRoute = require("./quadrant.route");

const router = express.Router();

const defaultIRoute = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/solar-system",
    route: solarSystemRoute,
  }, {
    path: "/quadrant",
    route: quadranRoute,
  }
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
