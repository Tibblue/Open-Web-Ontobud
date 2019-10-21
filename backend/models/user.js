var mongoose = require('mongoose')
var Schema = mongoose.Schema

// var QuerySchema = new Schema({
//   name: {type: String, required: true, unique: true},
//   query: {type: String, required: true},
//   global: {type: Boolean, required: true, default: false},
// })

var UserSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  // queries: {type: [QuerySchema], required: true, default: []},
})

module.exports = mongoose.model('User', UserSchema, 'user')