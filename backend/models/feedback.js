var mongoose = require('mongoose')
var Schema = mongoose.Schema

var FeedbackSchema = new Schema({
  rating: {type: Number, required: true},
  message: {type: String},
  date: {type: Date, default: Date.now, required: true},
})

module.exports = mongoose.model('Feedback', FeedbackSchema, 'feedback')