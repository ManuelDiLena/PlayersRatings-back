const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    name: String,
    passwordHash: String,
    players: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player'
        }
    ],
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
    tranform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject._v
        // The passwordHash should not be revealed
        delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User