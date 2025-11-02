const mongoose = require("mongoose");

const VoltageSchema = new mongoose.Schema({
  voltage: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Voltage", VoltageSchema);
