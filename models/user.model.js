const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      require: true,
      unique: true,
      min: 3,
      max: 20,
      trim: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  { dateStamp: true }
);

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
