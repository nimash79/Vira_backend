const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    fullname: {type: String, required: true, minLength: 3, maxLength: 50},
    mobile: {type: String, required: true, minLength: 11, maxLength: 11, unique: true},
    password: {type: String, required: true, minLength: 4},
    registerDate: {type: Date, default: Date.now},
    lastLoginDate: {type: Date, default: Date.now},
    activeCode: {type: Number, required: true, default: 0},
    isActive: {type: Boolean, required: true, default: false},
    pushToken: {type: String},
});

module.exports = mongoose.model('User', UserSchema);