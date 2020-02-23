var mongoose = require('mongoose')
var Schema = mongoose.Schema

var QuerySchema = new Schema({
  name: {type: String, required: true},
  query: {type: String, required: true},
  user_email: {type: String, required: true},
  repoID: {type: String},
})

QuerySchema.index({
  name: 1,
  user_email: 1,
}, {
  unique: true,
});

module.exports = mongoose.model('Query', QuerySchema, 'query')