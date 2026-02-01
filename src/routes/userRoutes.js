const express = require("express");
const { changePassword, getUser } = require("../controllers/userController");

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const user = await getUser({ userId: req.user.id });
        res.sendResponse({ status: 1, user });
    } catch (err) {
        res.sendError(err);
    }
})

router.post('/change-password', async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const data = await changePassword({ userId: req.user.id, oldPassword, newPassword });
        res.sendResponse(data);
    } catch (err) {
        res.sendError(err);
    }
})

module.exports = router;