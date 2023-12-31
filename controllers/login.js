const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()

const User = require('../models/user')

// Function that checks if a user is already registered
// If so it lets them login and provides them with a token
loginRouter.post('/', async (req, res) => {
    const body = req.body

    const user = await User.findOne({ username: body.username })
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return res.status(401).json({ error: 'invalid username or password' })
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    // Token expires in 60*60 seconds, that is, in one hour
    const token = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn: 60*60 }
    )

    res.status(200)
        .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter