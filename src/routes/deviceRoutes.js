const express = require("express");

const { changeZoneStates } = require("../controllers/deviceController");

const router = express.Router();

router.get("/download", async (req, res) => {
  const bytes = Buffer.from("JAHESH\n20 14 1", "utf8");

  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Disposition", 'attachment; filename="jahesh.txt"');
  res.setHeader("Content-Length", bytes.length);

  res.status(200).send(bytes);
});

router.post("/change-zone-states", async (req, res) => {
  try {
    const { deviceId, zone_states } = req.body;
    await changeZoneStates({ deviceId, zone_states });
    res.sendResponse({ status: 1 });
  } catch (err) {
    res.sendError(err);
  }
});

module.exports = router;
