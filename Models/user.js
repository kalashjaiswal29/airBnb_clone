const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  userType: {
    type: String,
    default: "User",
    enum: ["Guest", "Host"],
  },
  favourates: [
    {
      // an array with obid type
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
    },
  ],
  hostHomes: [
    {
      // an array with obid type
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
