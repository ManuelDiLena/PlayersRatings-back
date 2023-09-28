const express = require('express')
const app = express()

let players = [
    {
        id: 1,
        playerName: 'Lionel Messi',
        nation: 'Argentina',
        position: 'RW',
        team: 'Inter Miami (CAL)',
        rating: 99
    },
    {
        id: 2,
        playerName: 'Cristiano Ronaldo',
        nation: 'Portugal',
        position: 'ST',
        team: 'Al Nassr (ARA)',
        rating: 95
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Players Ratings</h1>')
})

// Function to get all resources
app.get('/api/players', (req, res) => {
    res.json(players)
})

// Function to get a specific resource
app.get('/api/players/:id', (req, res) => {
    const id = Number(req.params.id)
    const player = players.find(p => p.id === id)
    
    if (player) {
        res.json(player)
    } else {
        res.status(404).end()
    }
})

// Function to delete a specific resource
app.delete('/api/players/:id', (req, res) => {
    const id = Number(req.params.id)
    players = players.filter(p => p.id !== id)

    res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})