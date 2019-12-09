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

// Devolve a lista de queries de um user e repo em JSON
Queries.listByUserEmailRepo = (user_email, repoID) => {
  return Query
          .find({'user_email': user_email, 'repoID': repoID})
          .sort({name: 1})
          .exec()
}

// Devolve a lista de queries (Globais) de um user em JSON
Queries.listByUserEmailGlobal = (user_email) => {
  return Query
          .find({'user_email': user_email, 'repoID': {$exists: false}})
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

// Alterar query de um user
Queries.updateQueryValue = (user_email, queryName, query) => {
    return Query
        .findOneAndUpdate({'user_email': user_email, 'name': queryName}, query, {useFindAndModify: false})
        .exec()
}

// Apaga um query por nome e user email
Queries.deleteQuery = (user_email, name) => {
  return Query
          .findOneAndDelete({'user_email': user_email, 'name': name})
          .exec()
}
