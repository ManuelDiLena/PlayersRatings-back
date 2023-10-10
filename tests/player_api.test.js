const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Player = require('../models/player')

// Function to initialize the test database
beforeEach(async () => {
    await Player.deleteMany({})
    
    const playerObjects = helper.initialPlayers
        .map(player => new Player(player))
    const promiseArray = playerObjects.map(player => player.save())
    await Promise.all(promiseArray)
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

// Test to verify that a player is deleted
test('A player can be deleted', async () => {
    const playersAtStart = await helper.playersInDb()
    const playerToDelete = playersAtStart[0]

    await api
        .delete(`/api/players/${playerToDelete.id}`)
        .expect(204)

    const playersAtEnd = await helper.playersInDb()

    expect(playersAtEnd).toHaveLength(
        helper.initialPlayers.length - 1
    )

    const names = playersAtEnd.map(r => r.playerName)

    expect(names).not.toContain(playerToDelete.playerName)
})

// Function to terminate the connection with the test DB
afterAll(() => {
    mongoose.connection.close()
})