const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
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

// Function to initialize the test database
beforeEach(async () => {
    await Player.deleteMany({})
    let playerObject = new Player(initialPlayers[0])
    await playerObject.save()
    playerObject = new Player(initialPlayers[1])
    await playerObject.save()
})

// Test to see if we got all the players
test('All players are returned', async () => {
    const response = await api.get('/api/players')

    expect(response.body).toHaveLength(initialPlayers.length)
})

// Test to see if we got an Argentine player
test('The first player is from Argentina', async () => {
    const response = await api.get('/api/players')

    const contents = response.body.map(r => r.nation)
    expect(contents).toContain('Argentina')
})

// Function to terminate the connection with the test DB
afterAll(() => {
    mongoose.connection.close()
})