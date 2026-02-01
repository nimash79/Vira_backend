const jwt = require('jsonwebtoken');

const { User } = require('../models');
const { randomCode } = require('../utils/helper');
const { encrypt, comparePassword } = require('../utils/security');
const { sendMessagePattern } = require('../utils/messageService');
const { JWTKEY } = process.env;

exports.register = async body => {
    const { fullname, mobile, password } = body;
    let user = await User.findOne({ mobile });
    if (user) return { status: 2 };
    user = await User.create({ fullname, mobile, password: encrypt(password), activeCode: randomCode() });
    user.password = "";
    // send active code to user mobile
    const res = await sendMessagePattern({ mobile, activeCode: user.activeCode });
    console.log(res.data);
    return { status: 1, user };
}

exports.active = async ({ userId, code }) => {
    let user = await User.findById(userId);
    if (user.activeCode != code) return { status: 2 };
    user.isActive = true;
    user.activeCode = randomCode();
    await user.save();
    return { status: 1 };
}

exports.sendActiveCode = async ({ userId }) => {
    const user = await User.findById(userId);
    return { status: 1, code: user.activeCode };
}

exports.login = async body => {
    const { mobile, password, pushToken } = body;

    let user = await User.findOne({ mobile });
    if (!user) return { status: 2 };
    const compare = await comparePassword(user.password, password);
    if (!compare) return { status: 2 };

    if (!user.isActive) return { status: 3, userId: user._id };

    const token = jwt.sign({
        id: user.id,
        fullname: user.fullname,
        mobile: user.mobile,
        registerDate: user.registerDate,
        lastLoginDate: user.lastLoginDate,
    }, JWTKEY, { expiresIn: '24h' });
    user.lastLoginDate = Date.now();
    user.pushToken = pushToken;
    await user.save();
    return { status: 1, token };
}

exports.forgetPassword = async body => {
    const { mobile } = body;
    const user = await User.findOne({ mobile });
    if (!user) return { status: 2 };
    await sendMessagePattern({ mobile: user.mobile, activeCode: user.activeCode });
    return { status: 1, userId: user._id, code: user.activeCode };
}

exports.resetPassword = async body => {
    const { userId, newPassword } = body;
    const user = await User.findById(userId);
    if (!user) return { status: 2 };
    const hash = encrypt(newPassword);
    user.password = hash;
    await user.save();
    return { status: 1 };
}

exports.existsMobile = async mobile => {
    const user = await User.findOne({ mobile });
    if (user) return true;
    return false;
}