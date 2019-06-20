const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')


const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

require('./controllers/authController')(app)
require('./controllers/projectController')(app)



app.listen(3000, () => {
    console.log('backend executando na porta 3000')
})