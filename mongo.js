const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://adminuserdb:${password}@cluster0.k04gogy.mongodb.net/players-ratings?retryWrites=true&w=majority`

mongoose.connect(url)

const playerSchema = new mongoose.Schema({
    playerName: String,
    nation: String,
    position: String,
    team: String,
    rating: Number,
})

const Player = mongoose.model('Player', playerSchema)

const player = new Player({
    playerName: 'Manuel Di Lena',
    nation: 'Argentina',
    position: 'CF',
    team: 'Boca Juniors',
    rating: 100,
})

player.save().then(result => {
    console.log('player saved!')
    mongoose.connection.close()
})