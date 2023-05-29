const mongoose = require("mongoose");
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({

  username: {
    type: String,
    required: [true, 'Please enter an Username'],
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: [true, 'Please enter an Password'],
  },

  likedSongs: {
    type: [Object],
  },

})

const User = mongoose.model("user", UserSchema);

module.exports = User;
