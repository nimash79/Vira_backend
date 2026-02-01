const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  name: { type: String, required: true, minLength: 4, maxLength: 200 },
  value: { type: Number, required: true },
  on: { type: Boolean, default: false },
  createDate: { type: Date, default: Date.now },
  reset: { type: Boolean, default: false },
});

module.exports = mongoose.model("Device", DeviceSchema);
