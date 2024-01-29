require('dotenv').config();

const mongoose = require("mongoose");
const App = require('./app');

class Main {
  constructor() {
    this.app = null;
    this.dbConnection = null;
  }

  async init() {
    this.app = new App();
    this.app.init();
    await this.connectDB();
    this.serve();
  }

  serve() {
    this.app.serve();
  }

  async connectDB() {
    this.dbConnection = mongoose.connect(process.env.MONGODB_URL);
  }
}

const instance = new Main();
instance.init();
