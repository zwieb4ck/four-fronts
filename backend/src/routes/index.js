const express = require("express");
const authRoute = require("./auth.route");
const userRoute = require("./users.route");
const solarSystemRoute = require("./solar-system.route");

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
  }
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
