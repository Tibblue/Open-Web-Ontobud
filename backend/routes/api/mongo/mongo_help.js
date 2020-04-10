// Help Functions to Mongo processing


// process errors and return a more standard error response
function processError(error) {
  var status = 500
  var data = error // "MONGO unknown error :("
  // Duplicate Keys (Duplicate Query name and UserID)
  if (error.name === 'MongoError' && error.code === 11000) {
    status = 409
    data = error.errmsg // FIXME: prepare a more readable response
  }
  // Bad Request (missing required variable, bad syntax, etc)
  else if (error.name === 'ValidationError') {
    status = 400
    data = error.message
  }
  return {status: status, data: data}
}


// a list of exported variables
module.exports = {
  processError
};