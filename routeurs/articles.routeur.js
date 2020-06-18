var express = require('express')
var routeur = express.Router()
const twig = require('twig')
const articleController = require('../controllers/article.controller')

const multer = require('multer')

const storage = multer.diskStorage({
  destination: (requete, file, cb) => {
    cb(null, './public/images/')
  },
  filename: (requete, file, cb) => {
    var date = new Date().toLocaleDateString()
    cb(null, date + '-' + Math.round(Math.random() * 10000) + '-' + file.originalname)
  }
})

routeur.get('/', articleController.articles_affichage)
routeur.post('/', articleController.articles_ajout)
routeur.get('/:id', articleController.article_affichage)
routeur.get('/modification/:id', articleController.article_modification)
routeur.post('/modificationServer', articleController.article_modification_validation)
routeur.post('/delete/:id', articleController.article_suppression)

module.exports = routeur
