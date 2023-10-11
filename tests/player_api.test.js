const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Player = require('../models/player')
const User = require('../models/user')

// Function to initialize the test database
beforeEach(async () => {
    await Player.deleteMany({})
    await Player.insertMany(helper.initialPlayers)
})

describe('When there is initially some players saved', () => {
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
})

describe('Viewing a specific player', () => {
    // Test to get a specific player
    test('Succeeds with a valid id', async () => {
        const playersAtStart = await helper.playersInDb()

        const playerToView = playersAtStart[0]

        const resultPlayer = await api
            .get(`/api/players/${playerToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(resultPlayer.body).toEqual(playerToView)
    })

    // Test to check the response when a wrong ID is entered
    test('Fails with statuscode 400 id is invalid', async () => {
        const invalidId = '5a3d5da59070081a82a3445'

        await api
            .get(`/api/players/${invalidId}`)
            .expect(400)
    })
})

describe('Addition of a new player', () => {
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
})

describe('Deletion of a player', () => {
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
})

// Function to initialize the test database
beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
})

describe('When there is initially one user in DB', () => {
    // Test to verify the creation of a user in DB
    test('Creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'testuser',
            name: 'Test User',
            password: 'testuser',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    // Test to verify that users are not created with the same username
    test('Creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'User Duplicate',
            password: 'duplicate',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})


// Function to terminate the connection with the test DB
afterAll(() => {
    mongoose.connection.close()
})