// imports
const express = require('express');
const cors = require('cors');
const routes = require("./routes/")
const path = require("path");

class App {
  constructor() {
    this.instance = null;
  }

  init() {
    this.instance = express();
    this.setupMiddlewares();
    this.setupRoutes();
  }

  setupMiddlewares() {
    // body parser
    this.instance.use(express.json())

    // setup cors
    this.instance.use(cors());
    this.instance.options("*", cors());
  }

  setupRoutes() {
    this.instance.use('/', express.static('public/'));
    this.instance.use("/v1", routes);
    this.instance.get('/', function (req, res) {
      res.sendFile(path.join(__dirname, '../public/index.html'));

    });

  }

  serve() {
    this.instance.listen(process.env.PORT)
  }
}

module.exports = App;