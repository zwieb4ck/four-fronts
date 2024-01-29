const express = require("express");
const authRoute = require("./auth.route");
const userRoute = require("./users.route");

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
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
