var Query = require('../models/query')
const Queries = module.exports

// Devolve a lista de repos em JSON
Queries.list = () => {
  return Query
          .find()
          .sort({name: 1})
          .exec()
}

// Devolve a lista de repos em JSON
Queries.listByUserEmail = (email) => {
  return Query
          .find({user_email: email})
          .sort({name: 1})
          .exec()
}

// Devolve o numero de repos
Queries.count = () => {
  return Query
          .countDocuments()
          .exec()
}

// Devolve repo por name
Queries.getQuery = name => {
  return Query
          .findOne({name: name})
          .exec()
}


// Cria um repo
Queries.createQuery = repo => {
  return Query.create(repo)
}

// Apaga um repo por name
Queries.deleteQuery = name => {
  return Query
          .findOneAndDelete({name: name})
          .exec()
}
