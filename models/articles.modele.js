const mongoose = require('mongoose')

const articleSchema = mongoose.Schema({
  ref: String,
  quantity: Number,
  nom: String,
  description: String,
  marque: String,
  category: String
})
module.exports = mongoose.model('Article', articleSchema)
