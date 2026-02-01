const express = require("express");
const path = require("path");

const {
  resetPassword,
  forgetPassword,
  login,
  existsMobile,
  register,
  active,
  sendActiveCode,
} = require("../controllers/accountController");
const { randomCode } = require("../utils/helper");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const data = await register(req.body);
    if (data.status === 2) res.sendError("this mobile is already exists", 403);
    else res.sendResponse(data);
  } catch (err) {
    res.sendError(err);
  }
});

router.get("/active-code", async (req, res) => {
  try {
    const code = randomCode();
    console.log(`active code: ${code}`);
    res.sendResponse({ status: 1, code });
  } catch (err) {
    res.sendError(err);
  }
});

router.post("/active", async (req, res) => {
  try {
    const { userId, code } = req.body;
    console.log({ userId, code });
    const data = await active({ userId, code });
    if (data.status === 2) return res.sendError("invalid code", 400);
    res.sendResponse(data);
  } catch (err) {
    res.sendError(err);
  }
});

router.get("/send-active-code/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await sendActiveCode({ userId });
    res.sendResponse(data);
  } catch (err) {
    res.sendError(err);
  }
})

router.post("/login", async (req, res) => {
  try {
    const data = await login(req.body);
    if (data.status === 2) res.sendError("user not found", 404);
    else res.sendResponse(data);
  } catch (err) {
    res.sendError(err);
  }
});

router.post("/forget-password", async (req, res) => {
  try {
    const data = await forgetPassword(req.body);
    if (data.status === 2) return res.sendError("user not found", 404);
    console.log(`active code: ${data.code}`);
    res.sendResponse(data);
  } catch (err) {
    res.sendError(err);
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const data = await resetPassword(req.body);
    if (data.status === 2) return res.sendError("user not found", 404);
    res.sendResponse(data);
  } catch (err) {
    res.sendError(err);
  }
});

router.get("/exists-mobile/:mobile", async (req, res) => {
  try {
    const { mobile } = req.params;
    const exists = await existsMobile(mobile);
    res.sendResponse({ status: 1, exists });
  } catch (err) {
    res.sendError(err);
  }
});

module.exports = router;
