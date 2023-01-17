const mongoose = require('mongoose')
const validator = require('validator')

const username_validation = /^[a-zA-Z\-]+$/;

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if (value.match(username_validation) == null) {
                throw new Error("Invalid username.")
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Entered email is not valid.")
            }
        }
    },
    dob: {
        type: Date,
        required: true,
        trim: true
    },
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    notes: [{
        type: Object
    }],
}, {
    timestamps: true,
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    return userObject
}

const User = mongoose.model('User', userSchema)

module.exports = User