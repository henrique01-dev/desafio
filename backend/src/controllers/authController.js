const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const authConfig = require('../config/auth')
const User = require('../models/user')

const EXPIRATION_ONE_DAY = 86400

const router = express.Router()

// rota de registro
router.post('/register', async (req, res) => {
    const { email } = req.body
    try {
        if (await User.findOne({ email })) {
            return res.status(400).send({ error: 'Usuário já cadastrado no sistema' })
        }
        const user = await User.create(req.body)

        user.password = undefined

        return res.send({
            user,
            token: generateToken({ id: user.id })
        })

    } catch (err) {
        return res.status(400).send({ error: 'Falha ao cadastrar' })
    }
})

// rota de autenticação
router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return res.status(400).send({ error: 'Usuário não encontrado' })
    }

    if (!await bcrypt.compare(password, user.password)) {
        return res.status(400).send({ error: 'Senha incorreta' })
    }

    user.password = undefined

    res.send({
        user,
        token: generateToken({ id: user.id })
    })

})

generateToken = (params = {}) => {

    const token = jwt.sign(params, authConfig.secret, {
        expiresIn: EXPIRATION_ONE_DAY
    })
    return token
}

module.exports = app => app.use('/auth', router)