const playersRouter = require('express').Router()
const Player = require('../models/player')

// Controller to get all players on the server
playersRouter.get('/', (req, res) => {
    Player.find({}).then(players => {
        res.json(players)
    })
})

// Controller to get a specific player
playersRouter.get('/:id', (req, res, next) => {
    Player.findById(req.params.id)
        .then(player => {
            if (player) {
                res.json(player)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

// Controller to create a new player
playersRouter.post('/', (req, res, next) => {
    const body = req.body

    const player = new Player({
        playerName: body.playerName,
        nation: body.nation,
        position: body.position,
        team: body.team,
        rating: body.rating
    })

    player.save()
        .then(savedPlayer => {
            res.json(savedPlayer)
        })
        .catch(error => next(error))
})

// Controller to delete a specific player
playersRouter.delete('/:id', (req, res, next) => {
    Player.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

module.exports = playersRouter