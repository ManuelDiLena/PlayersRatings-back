const playersRouter = require('express').Router()

const Player = require('../models/player')
const User = require('../models/user')

const jwt = require('jsonwebtoken')

// Function to separate the token from the authorization header
const getTokenFrom = req => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

// Controller to get all players on the server
playersRouter.get('/', async (req, res) => {
    const players = await Player
        .find({}).populate('user', { username: 1, name: 1 })
    res.json(players)
})

// Controller to get a specific player
playersRouter.get('/:id', async (req, res) => {
    const player = await Player.findById(req.params.id)
    if (player) {
        res.json(player)
    } else {
        res.status(404).end()
    }
})

// Controller to create a new player
playersRouter.post('/', async (req, res) => {
    const body = req.body
    const token = getTokenFrom(req)
    console.log(token)

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const player = new Player({
        playerName: body.playerName,
        nation: body.nation,
        position: body.position,
        team: body.team,
        rating: body.rating,
        user: user._id
    })

    const savedPlayer = await player.save()
    user.players = user.players.concat(savedPlayer._id)
    await user.save()

    res.json(savedPlayer)
})

// Controller to delete a specific player
playersRouter.delete('/:id', async (req, res) => {
    await Player.findByIdAndRemove(req.params.id)
    res.status(204).end()
})

module.exports = playersRouter