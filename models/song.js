const mongoose = require('mongoose')
const Song = new mongoose.model('song', {
  songname: {
    type: String,
    required: true
  },
  artist: {
    type: String
  },
  album: {
    type: String
  },
  size: {
    type: Number
  },
  dateReleased: {
    type: Date
  },
  genre: {
    type: String
  },
  location: {
    type: String
  },
  rating: {
    type: Number,
    default: 0
  }
})

module.exports = Song