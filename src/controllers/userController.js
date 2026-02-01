const { User } = require('../models');
const { comparePassword, encrypt } = require('../utils/security');

exports.getUser = async ({ userId }) => {
    const user = await User.findById(userId);
    return user;
}

exports.changePassword = async ({ userId, oldPassword, newPassword }) => {
    const user = await User.findById(userId);
    const compare = await comparePassword(user.password, oldPassword);
    if (!compare) return { status: 3 };
    const hash = encrypt(newPassword);
    user.password = hash;
    await user.save();
    return { status: 1 };
}