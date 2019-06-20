const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.json')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) return res.status(401).send({ error: 'Token inexistente' })

    const parts = authHeader.split(' ')

    if (!parts.length === 2) {
        return res.status(401).send({ error: 'Erro no token de autenticação' })
    }

    const [scheme, token] = parts

    if (!/^Bearear$/i.test(scheme)) return res.status(401).send({ error: 'Token inapropriado' })

    jwt.verify(token, authConfig.secret, (error, decoded) => {
        if (error) return res.status(401).send({ error: 'Token inválido' })

        req.userId = decoded.id

        return next()
    })
}