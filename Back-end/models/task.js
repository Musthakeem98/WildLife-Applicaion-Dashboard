const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    complainId: { type: String, required: true },
    OfficerId: {type: String, required: true},
    officerName:{type: String, required: true},
    adminOfficer: { type: String, required: true },
    note: { type: String, required: true },
    date: {type: Date, required:true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("task", TaskSchema);