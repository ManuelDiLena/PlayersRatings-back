const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Player = require('../models/player')

// Function to initialize the test database
beforeEach(async () => {
    await Player.deleteMany({})
    
    let playerObject = new Player(helper.initialPlayers[0])
    await playerObject.save()

    playerObject = new Player(helper.initialPlayers[1])
    await playerObject.save()
})

// Test to see if we got all the players
test('All players are returned', async () => {
    const response = await api.get('/api/players')

    expect(response.body).toHaveLength(helper.initialPlayers.length)
})

// Test to see if we got an Argentine player
test('The first player is from Argentina', async () => {
    const response = await api.get('/api/players')

    const contents = response.body.map(r => r.nation)
    expect(contents).toContain('Argentina')
})

// Test adding a new player and verifying that the number of returned players increases
test('A valid player can be added', async () => {
    const newPlayer = {
        playerName: 'Test Player',
        nation: 'International',
        position: 'XX',
        team: 'Test Team',
        rating: 99,
    }

    await api
        .post('/api/players')
        .send(newPlayer)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const playersAtEnd = await helper.playersInDb()
    expect(playersAtEnd).toHaveLength(helper.initialPlayers.length + 1)

    const nations = playersAtEnd.map(p => p.nation)
    expect(nations).toContain('International')
})

// Test that verifies that an unnamed player will not be saved in the database
test('Player without name is not added', async () => {
    const newPlayer = {
        nation: 'International',
        position: 'XX',
        team: 'Test Team',
        rating: 99,
    }

    await api 
        .post('/api/players')
        .send(newPlayer)
        .expect(400)

    const playersAtEnd = await helper.playersInDb()

    expect(playersAtEnd).toHaveLength(helper.initialPlayers.length)
})

// Function to terminate the connection with the test DB
afterAll(() => {
    mongoose.connection.close()
})