const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  on: { type: Boolean, default: false },
  createDate: { type: Date, default: Date.now },
  reset: { type: Boolean, default: false },
  menu_password: { type: String, required: true, unique: true },
  sms_password: { type: String, required: true, unique: true },
  zones: { type: Number, required: true, unique: true },
  zone_states: { type: Array, required: true, unique: true },
});

module.exports = mongoose.model("Device", DeviceSchema);
