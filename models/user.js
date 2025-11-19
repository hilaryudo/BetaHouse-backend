const mongoose = require('mongoose');
const {isEmail} = require('validator');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "please provide firstname"]
    },

    lastname: {
        type: String,
        required: [true, "please provide lastname"]
    },

    email: {
        type: String,
        required: [true, "please provide an email address"],
        unique: true,
        validate: [isEmail, 'please provide a valid email address']
    },

    password: {
        type: String,
        required: [true, 'please provide your password'],
        minlength: [8, 'password must be at least 8 characters']
    },

    role: {
        type: String,
        default: 'user',
        enum: ['user','admin'], 
        
    }
}, {timestamps: true}
);



module.exports = mongoose.model('User', userSchema)