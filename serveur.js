const express = require('express')
const server = express()
const morgan = require('morgan')
const routerArticle = require('./routeurs/articles.routeur')
const routerGlobal = require('./routeurs/global.routeur')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const multer = require('multer')
const upload = multer()

server.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

mongoose.connect('mongodb://localhost/gestionDuStock', { useNewUrlParser: true, useUnifiedTopology: true })

server.use(express.static('public'))
server.use(morgan('dev'))
server.use(bodyParser.urlencoded({ extended: false }))
server.use(upload.array())
server.set('trust proxy', 1)

server.use((requete, reponse, suite) => {
  reponse.locals.message = requete.session.message
  delete requete.session.message
  suite()
})

server.use('/articles/', routerArticle)

server.use('/', routerGlobal)

server.listen(3000)
