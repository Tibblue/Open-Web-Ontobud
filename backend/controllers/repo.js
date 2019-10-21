var Repo = require('../models/repo')
const Repos = module.exports

// Devolve a lista de repos em JSON
Repos.list = () => {
  return Repo
          .find()
          .sort({id: 1})
          .exec()
}

// Devolve o numero de repos
Repos.count = () => {
  return Repo
          .countDocuments()
          .exec()
}

// Devolve repo por id
Repos.getRepo = id => {
  return Repo
          .findOne({id: id})
          .exec()
}


// Cria um repo
Repos.createRepo = repo => {
  return Repo.create(repo)
}

// Apaga um repo por id
Repos.deleteRepo = id => {
  return Repo
          .findOneAndDelete({id: id})
          .exec()
}
