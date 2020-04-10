var Feedback = require('../models/feedback')
const Feedbacks = module.exports

// Devolve a lista de feedbacks em JSON
Feedbacks.list = () => {
  return Feedback
          .find()
          .sort({rating: 1})
          .exec()
}

// Devolve o numero de feedbacks
Feedbacks.count = () => {
  return Feedback
          .countDocuments()
          .exec()
}

// create feedback
Feedbacks.create = feedback => {
  return Feedback.create(feedback)
}
