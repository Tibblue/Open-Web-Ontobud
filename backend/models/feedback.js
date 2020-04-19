var mongoose = require('mongoose')
var Schema = mongoose.Schema

var FeedbackSchema = new Schema({
  rating: {type: Number, required: true},
  message: {type: String},
  intuitive: {type: Number, required: true},
  style: {type: Number, required: true},
  useAgain: {type: Number, required: true},
  anyBugs: {type: Number, required: true},
  date: {type: Date, default: Date.now, required: true},
})

module.exports = mongoose.model('Feedback', FeedbackSchema, 'feedback')