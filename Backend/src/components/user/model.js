const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    username: {
        type: String
    },
    email: {
        type: String, 
        unique: true
    },
    password: {
        type: String, 
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = model('user', UserSchema)