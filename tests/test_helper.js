const Player = require('../models/player')

const initialPlayers = [
    {
        playerName: 'Lionel Messi',
        nation: 'Argentina',
        position: 'RW',
        team: 'Inter Miami (CAL)',
        rating: 99,
    },
    {
        playerName: 'Cristiano Ronaldo',
        nation: 'Portugal',
        position: 'ST',
        team: 'Al Nassr (ARA)',
        rating: 95,
    },
]

// Function to check players stored in DB
const playersInDb = async () => {
    const players = await Player.find({})
    return players.map(player => player.toJSON())
}

module.exports = {
    initialPlayers, playersInDb
}