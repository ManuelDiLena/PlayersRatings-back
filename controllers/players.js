const playersRouter = require('express').Router()
const Player = require('../models/player')

// Controller to get all players on the server
playersRouter.get('/', async (req, res) => {
    const players = await Player.find({})
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

    const player = new Player({
        playerName: body.playerName,
        nation: body.nation,
        position: body.position,
        team: body.team,
        rating: body.rating
    })

    const savedPlayer = await player.save()
    res.json(savedPlayer)
})

// Controller to delete a specific player
playersRouter.delete('/:id', async (req, res) => {
    await Player.findByIdAndRemove(req.params.id)
    res.status(204).end()
})

module.exports = playersRouter