var mongoose = require('mongoose')
var Schema = mongoose.Schema

var QuerySchema = new Schema({
  name: {type: String, required: true, unique: true},
  query: {type: String, required: true},
  user_email: {type: String, required: true, unique: true},
  repoID: {type: String},
})

module.exports = mongoose.model('Query', QuerySchema, 'query')