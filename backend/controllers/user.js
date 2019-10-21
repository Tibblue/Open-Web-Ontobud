var User = require('../models/user')
const Users = module.exports

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


// Cria um user
Users.createUser = user => {
  return User.create(user)
}

// Apaga um user por email
Users.deleteUser = email => {
  return User
          .findOneAndDelete({email: email})
          .exec()
}

// Atualiza um user
// Users.updateUser = (email, user) => {
//     return User
//         .findOneAndUpdate({email: email}, user, {useFindAndModify: false})
//         .exec()
// }

// // Alterar password de um user
// Users.updateUserPassword = (email, password) => {
//     return User
//         .findOneAndUpdate({email: email}, password, {useFindAndModify: false})
//         .exec()
// }
