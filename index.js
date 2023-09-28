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

app.get('/api/players', (req, res) => {
    res.json(players)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})