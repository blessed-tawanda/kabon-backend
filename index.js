// 3rd Party Dependencies
const express = require('express')
const bodyParser = require('body-parser')
const expressFileupload = require('express-fileupload')
const _ = require('lodash')

//Node Modules
const fs = require('fs');

//User Defined Requirements
const mongoose = require('./db/db')
const Song = require('./models/song')
const helper = require('./helper')

// Express Apps Instances
var app = express()
var dashboard = express()

const ejs = require('ejs')

//#Dashboard Start

// Dashboard Middleware
dashboard.set('view-engine', 'ejs')
dashboard.use(express.static(__dirname+'/public'))
dashboard.use(expressFileupload())
dashboard.use(bodyParser.urlencoded({extended:true}))

// Dashboard Routes
dashboard.get('/', (req,res) => {
  res.render('index.ejs')
})

dashboard.post('/upload', (req,res) => {
  const songDetails = _.pick(req.body, ['songname','artist','album','dateReleased','genre','song'])
  const location = __dirname + '/songs/' + req.files.song.name
  songDetails.location = '/songs/' + req.files.song.name
  req.files.song.mv(location, (err) => {
    if(err) {
      res.sendStatus(500)
    } else {
      var song = new Song(songDetails)
      song.save().then((song) => {
        console.log('Song added')
        res.redirect('/')
      }, (err) => {
        console.log('Could not save to database')
      })
    }
  })

})

dashboard.listen(3001, ()=> {
  console.log(`Dashboard To Add Songs On http://localhost:${3001}`)
})

//#Dashboard End


//#App Start

// route to stream song
app.get('/song/play/:songid', async (req,res) => {
  var songid = req.params.songid
  var songDetails = null
  await Song.findById(songid).then((song) => {
    if(song) 
      songDetails = song
  })
  if(songDetails) {
    const rr = fs.createReadStream(`${__dirname}${songDetails.location}`);
    rr.pipe(res)  
  } else {
    res.sendStatus(404)
  }
})

// route to get all songs in db
app.get('/song/list/all', async (req, res) => {
  var allSongs = null
  await Song.find({}).select('_id songname artist album genre dateReleased').then((songs)=> {
    if(songs)
      allSongs = songs
  })
  if(allSongs.length > 0) {
    res.json(allSongs)
  } else {
    res.status(404).json({message: `No Songs Yet`})
  }
})

// View Album List
app.get('/song/list/album/:albumname', async (req, res) => {
  var allSongs = null
  await Song.find({album: req.params.albumname}).select('_id songname artist album genre').then((songs)=> {
    if(songs)
      allSongs = songs
  })

  if(allSongs.length > 0) {
    res.json(allSongs)
  } else {
    res.status(404).json({message: `No Albums By Name ${req.params.albumname}`})
  }
})

app.listen(3000, ()=> {
  console.log(`Streaming Service on http://localhost:${3000}`)
})

//#App End

