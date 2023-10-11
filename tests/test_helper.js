const Player = require('../models/player')
const User = require('../models/user')

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
    return players.map(p => p.toJSON())
}

// Function to check users stored in DB
const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    initialPlayers, playersInDb, usersInDb,
}