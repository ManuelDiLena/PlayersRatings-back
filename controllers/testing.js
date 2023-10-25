const router = require('express').Router()
const Player = require('../models/player')
const User = require('../models/user')

router.post('/reset', async (req, res) => {
    await Player.deleteMany({})
    await User.deleteMany({})

    res.status(204).end()
})

module.exports = router