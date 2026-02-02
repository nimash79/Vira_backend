const { default: mongoose } = require("mongoose");
const { Device, User } = require("../models");
const { randomCode, generateRandomDeviceId } = require("../utils/helper");

exports.createBinary = (obj) => {
  function zoneArrayToBitmask(zones) {
    let mask = 0;
    zones.forEach((state, index) => {
      if (state) mask |= 1 << index;
    });
    return mask;
  }

  const buffer = Buffer.alloc(10);
  buffer.writeUInt32BE(obj.deviceId, 0);
  buffer.writeUInt16BE(parseInt(obj.menu_password), 4);
  buffer.writeUInt16BE(parseInt(obj.sms_password), 6);
  buffer.writeUInt8(obj.zones, 8);
  buffer.writeUInt8(zoneArrayToBitmask(obj.zone_states), 9);
  const hexString = buffer.toString("hex");
  return hexString;
};

exports.addDevice = async ({ userId, mobile, count }) => {
  const currentDevices = await Device.find({}).select("deviceId");
  const currentDevicesOfUser = await Device.find({ userId }).select([
    "name",
    "latitude",
    "longitude",
  ]);
  let number = 1;
  const promises = [];
  for (let i = 0; i < count; i++) {
    // generate device id
    let deviceId = generateRandomDeviceId().toString();
    while (currentDevices.map((d) => d.deviceId).includes(deviceId))
      deviceId = generateRandomDeviceId().toString();
    // generate name
    const prefix = "دستگاه ";
    let name = prefix + number;
    while (currentDevicesOfUser.map((d) => d.name).includes(name)) {
      number++;
      name = prefix + number;
    }
    number++;
    const promise = Device.create({
      userId,
      deviceId,
      name,
      temperature: 15,
      value: 15,
      battery: 100,
      latitude: currentDevicesOfUser.length
        ? currentDevicesOfUser[0].latitude
        : 0,
      longitude: currentDevicesOfUser.length
        ? currentDevicesOfUser[0].longitude
        : 0,
    });
    promises.push(promise);
  }
  const devices = await Promise.all(promises);
  return devices;
};

exports.existsDevice = async ({ deviceId }) => {
  return await Device.exists({ deviceId });
};

exports.getDevicesOfUser = async ({ userId }) => {
  const devices = await Device.find({ userId });
  return devices;
};

exports.getDevice = async ({ deviceId }) => {
  const device = await Device.findOne({ deviceId });
  return device;
};

exports.getSelectedDevices = async ({ deviceIds }) => {
  if (!Array.isArray(deviceIds)) deviceIds = [deviceIds];
  const devices = await Device.aggregate([
    {
      $match: {
        deviceId: { $in: deviceIds },
      },
    },
    {
      $lookup: {
        from: "reports",
        let: { device_id: "$deviceId" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$deviceId", "$$device_id"] },
            },
          },
          {
            $sort: { reportDate: -1 },
          },
          {
            $skip: 1,
          },
          {
            $limit: 1,
          },
        ],
        as: "secondReport",
      },
    },
  ]);
  return devices;
};

exports.deleteDevices = async ({ deviceIds }) => {
  await Device.deleteMany({ deviceId: { $in: deviceIds } });
};

exports.changeZoneStates = async ({ deviceId, zone_states }) => {
  await Device.updateOne({ deviceId }, { $set: { zone_states } });
};

exports.getZoneStates = async ({ deviceId }) => {
  const device = await this.getDevice({deviceId});
  return device.zone_states;
};
