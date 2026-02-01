const bcrypt = require('bcryptjs');

exports.encrypt = text => {
    return bcrypt.hashSync(text, 10);
}

exports.comparePassword = async (password, enteredPassword) => {
    return bcrypt.compareSync(enteredPassword, password);
}