var Query = require('../models/query')
const Queries = module.exports

// Devolve a lista de queries em JSON
Queries.list = () => {
  return Query
          .find()
          .sort({name: 1})
          .exec()
}

// Devolve a lista de queries de um user em JSON
Queries.listByUserEmail = (user_email) => {
  return Query
          .find({'user_email': user_email})
          .sort({name: 1})
          .exec()
}

// Devolve o numero de queries
Queries.count = () => {
  return Query
          .countDocuments()
          .exec()
}

// Devolve query por name
Queries.getQuery = (name) => {
  return Query
          .findOne({'name': name})
          .exec()
}


// Cria um query
Queries.createQuery = (repo) => {
  return Query.create(repo)
}

// Apaga um query por nome e user email
Queries.deleteQuery = (name, user_email) => {
  return Query
          .findOneAndDelete({'name': name, 'user_email': user_email})
          .exec()
}
