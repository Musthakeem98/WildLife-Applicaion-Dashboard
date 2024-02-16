const mongoose = require("mongoose");

const OfficerSchema = new mongoose.Schema(
  {
    officerId: { type: String, required: true },
    name: {type: String, required: true},
    email: { type: String, required: true },
    address: { type: String, required: true },
    divistion: { type: String, required: true },
    type: {type: String, required: true},
    telNumber: { type: Number, required: true },
    nic: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Officer", OfficerSchema);