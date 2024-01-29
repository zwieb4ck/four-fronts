// init dotenv
require('dotenv').config()

// imports
const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose");

// model imports
const User = require("./models/User.model")

// initialize
const app = express();

mongoose.connect(process.env.MONGODB_URL);

// replace with database
const users = [];
const refreshTokens = [];

// private functions for endpoints
// TODO: cleanup

// middlewares


// routes




app.listen(5000)
