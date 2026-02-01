const express = require("express");

const router = express.Router();

router.get("/download", async (req, res) => {
  const bytes = Buffer.from("JAHESH\n20 14 1", "utf8");

  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Disposition", 'attachment; filename="jahesh.txt"');
  res.setHeader("Content-Length", bytes.length);

  res.status(200).send(bytes);
});

module.exports = router;
