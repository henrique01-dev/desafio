const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/desafio')

mongoose.Promise = global.Promise

module.exports = mongoose