const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
    playerName: {
        type: String,
        minlength: 5,
        required: true
    },
    nation: String,
    position: String,
    team: String,
    rating: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

playerSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject._v
    }
})

module.exports = mongoose.model('Player', playerSchema)