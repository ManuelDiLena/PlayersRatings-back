const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
    playerName: String,
    nation: String,
    position: String,
    team: String,
    rating: Number,
})

playerSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject._v
    }
})

module.exports = mongoose.model('Player', playerSchema)