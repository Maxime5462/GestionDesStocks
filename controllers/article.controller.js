const mongoose = require('mongoose')
const ArticleSchema = require('../models/articles.modele')
const fs = require('fs')

exports.articles_affichage = (requete, reponse) => {
  ArticleSchema.find()
    .exec()
    .then(articles => {
      reponse.render('articles/liste.html.twig', {
        liste: articles,
        message: reponse.locals.message
      })
    })
    .catch(error => {
      console.log(error)
    })
}

exports.articles_ajout = (requete, reponse) => {
  const article = new ArticleSchema({
    ref: requete.body.ref,
    quantity: requete.body.quantity,
    nom: requete.body.nom,
    description: requete.body.description,
    marque: requete.body.marque,
    category: requete.body.category

  })
  article.save()
    .then(resultat => {
      reponse.redirect('/articles')
    })
    .catch(error => {
      console.log(error)
    })
}

exports.article_affichage = (requete, reponse) => {
  ArticleSchema.findById(requete.body.identifiant)
    .exec()
    .then(article => {
      reponse.render('articles/article.html.twig', { article: article, isModification: false })
    })
    .catch(error => {
      console.log(error)
    })
}

exports.article_modification = (requete, reponse) => {
  ArticleSchema.find()
    .exec()
    .then(article => {
      reponse.render('articles/article.html.twig', {
        article: article,
        isModification: true
      })
    })
    .catch(error => {
      console.log(error)
    })
}

exports.article_modification_validation = (requete, reponse) => {
  console.log(requete.body.identifiant)
  const articleUpdate = {
    ref: requete.body.ref,
    quantity: requete.body.quantity,
    name: requete.body.name,
    description: requete.body.description,
    marque: requete.body.marque,
    category: requete.body.category
  }
  ArticleSchema.update({ _id: requete.body.identifiant }, articleUpdate)
    .exec()
    .then(resultat => {
      if (resultat.nModified < 1) throw new Error('Requete de modification échouée')
      requete.session.message = {
        type: 'success',
        contenu: 'modification effectuée'
      }
      reponse.redirect('/articles')
    })
    .catch(error => {
      console.log(error)
      requete.session.message = {
        type: 'danger',
        contenu: error.message
      }
      reponse.redirect('/articles')
    })
}

exports.article_suppression = (requete, reponse) => {
  ArticleSchema.findById(requete.params.id)
    .select('image')
    .exec()
    .then(article => {
      fs.unlink('./public/images/' + article.image, error => {
        console.log(error)
      })
      ArticleSchema.remove({ _id: requete.params.id })
        .exec()
        .then(resultat => {
          requete.session.message = {
            type: 'success',
            contenu: 'Suppression effectuée'
          }
          reponse.redirect('/articles')
        })
        .catch(error => {
          console.log(error)
        })
    })
    .catch(error => {
      console.log(error)
    })
}
