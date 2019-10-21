var mongoose = require('mongoose')
var Schema = mongoose.Schema

var RepoSchema = new Schema({
  id: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  owner_email: {type: String, required: true},
})

module.exports = mongoose.model('Repo', RepoSchema, 'repo')