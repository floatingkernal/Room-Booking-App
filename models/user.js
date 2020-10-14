let mongoose = require('mongoose');
let validator = require('validator');

let userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxlength: 25
    },
    lastName: {
        type: String,
        required: true,
        maxlength: 30
    },
    salt: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: (value) => {
            return validator.isEmail(value)
          }
    },
    birthday: Date,
    location: String
});

const User = mongoose.model('User', userSchema);
module.exports = User;