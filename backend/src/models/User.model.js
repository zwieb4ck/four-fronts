const mongoose = require('mongoose');
const validator = require('validator');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    },
  },
  token: String,
  refreshToken: String,
  isAdmin: Boolean,
  isSuperAdmin: Boolean,
});

module.exports = mongoose.model("User", userSchema);