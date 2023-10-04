require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

const Player = require('./models/player')

// Middleware that prints on each request made
const requestLogger = (req, res, next) => {
    console.log('Method: ', req.method)
    console.log('Path: ', req.path)
    console.log('Body: ', req.body)
    console.log('---')
    next()
}

// Middleware used to capture requests to non-existent routes
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json())
app.use(requestLogger)

let players = [
    // {
    //     id: 1,
    //     playerName: 'Lionel Messi',
    //     nation: 'Argentina',
    //     position: 'RW',
    //     team: 'Inter Miami (CAL)',
    //     rating: 99
    // },
    // {
    //     id: 2,
    //     playerName: 'Cristiano Ronaldo',
    //     nation: 'Portugal',
    //     position: 'ST',
    //     team: 'Al Nassr (ARA)',
    //     rating: 95
    // }
]

// Function to generate id
const generateId = () => {
    const maxId = players.length > 0
        ? Math.max(...players.map(p => p.id))
        : 0
    return maxId + 1
}

app.get('/', (req, res) => {
    res.send('<h1>Players Ratings</h1>')
})

// Function to get all resources
app.get('/api/players', (req, res) => {
    Player.find({}).then(players => {
        res.json(players)
    })
})

// Function to get a specific resource
app.get('/api/players/:id', (req, res) => {
    Player.findById(req.params.id)
        .then(player => {
            if (player) {
                res.json(player)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

// Function to add resources
app.post('/api/players', (req, res) => {
    const body = req.body

    if (!body.playerName) {
        return res.status(400).json({
            error: 'Content missing'
        })
    }

    const player = new Player({
        playerName: body.playerName,
        nation: body.nation,
        position: body.position,
        team: body.team,
        rating: body.rating,
    })

    player.save().then(savedPlayer => {
        res.json(savedPlayer)
    })
})

// Function to delete a specific resource
app.delete('/api/players/:id', (req, res) => {
    const id = Number(req.params.id)
    players = players.filter(p => p.id !== id)

    res.status(204).end()
})

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})