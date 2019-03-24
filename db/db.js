const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/kabonstream',{
  useNewUrlParser: true,
  useCreateIndex: true
})

module.exports = mongoose