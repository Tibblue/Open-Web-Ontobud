var express = require('express');
var router = express.Router();
var axios = require('axios')

/* GET home page. */
router.get('/', function(req, res, next) {
    axios.get(req.app.locals.url+"api/noticias/")
        .then(lista => res.render("home", {title:'Home', lista: lista.data}))
        .catch(error => {
            console.log("Error while getting article: " + error)
            res.render("error", {message: "getting noticia", error: error})
        })
});

module.exports = router;
