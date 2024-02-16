const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: {type: String, required: true},
    email: { type: String, required: true },
    address: { type: String, required: true },
    telNumber: { type: Number, required: true },
    nic: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);