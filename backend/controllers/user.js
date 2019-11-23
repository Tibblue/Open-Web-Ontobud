var User = require('../models/user')
const Users = module.exports
var bcrypt = require("bcrypt")
const saltRounds = 10

// Devolve a lista de users em JSON
Users.list = () => {
  return User
          .find()
          .sort({email: 1})
          .exec()
}

// Devolve o numero de users
Users.count = () => {
  return User
          .countDocuments()
          .exec()
}

// Devolve user por email
Users.getUser = email => {
  return User
          .findOne({email: email})
          .exec()
}


//// Auth
// validate password
Users.isValidPassword = (password, passwordStored) => {
  return bcrypt.compare(password, passwordStored)
}

// create user
Users.createUser = user => {
  user.password = bcrypt.hashSync(user.password,saltRounds)
  return User.create(user)
}

// Alterar password de um user
Users.updateUserPassword = (email, password) => {
  password = bcrypt.hashSync(password, saltRounds)
  return User
          .findOneAndUpdate({email: email}, password, {useFindAndModify: false})
          .exec()
}

// delete user
// TODO check password
Users.deleteUser = email => {
  return User
          .findOneAndDelete({email: email})
          .exec()
}



//// Old stuff ////
// // Atualiza um user
// Users.updateUser = (email, user) => {
//     return User
//         .findOneAndUpdate({email: email}, user, {useFindAndModify: false})
//         .exec()
// }

