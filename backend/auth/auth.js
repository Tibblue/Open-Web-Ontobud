var fs = require("fs")
var UserController = require("../controllers/user")
// Token Verification
var passport = require("passport")
var localStrategy = require("passport-local").Strategy
var JWTstrategy = require("passport-jwt").Strategy
var ExtractJWT = require("passport-jwt").ExtractJwt
var jwt = require("jsonwebtoken")

// Users Login
passport.use("login", new localStrategy({
  usernameField: "email",
  passwordField: "password"
}, async (email, password, done) => {
  try {
    user = await UserController.getUser(email)
    if (!user) return done(null, false, {message: "User not found!"})
    // if (!user.approved) return done(null, false, {message: "User not approved by admin!"})
    var validPass = await UserController.isValidPassword(password, user.password)
    if (!validPass) return done(null, false, {message: "Incorrect Password!"})

    return done(null, user, {message: "User authenticated!"})
  }
  catch (error) {
    return done(error)
  }
}))


passport.use("jwt", new JWTstrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  algorithms: ["RS256"],
  secretOrKey: fs.readFileSync("./auth/ontoworks.key.pub", "utf8")
}, async (jwt_payload, done) => {
  // console.log(jwt_payload) // debug: comfirm payload quality
  try {
    return done(null, jwt_payload.user)
  }
  catch (error) {
    return done(error)
  }
}))

// Check if user is authenticated
module.exports.isAuthenticated = passport.authenticate("jwt", {
  session: false,
})

const tokenOptions = {
  // expiresIn: '4h',
  algorithm: "RS256"
}

// Generates token with userInfo
module.exports.genToken = function(userInfo){
  var privateKey = fs.readFileSync("./auth/ontoworks.key", "utf8")
  var token = jwt.sign({user: userInfo}, privateKey, tokenOptions)
  return token
}

// Reverts token to userInfo
module.exports.reverseToken = function (userToken) {
  var publicKey = fs.readFileSync("./auth/ontoworks.key.pub", "utf8")
  var legit = jwt.verify(userToken, publicKey, tokenOptions)
  return legit
}


// user permissions verification to access page
// level var is a list with the type of users that have permissions
// module.exports.havePermissions = function (level) {
//   return function (req, res, next) {
//     var size = level.length
//     var haveP = false
//     for (var i = 0; i < size; i++)
//       if (level[i] == req.session.type) haveP = true
//     if (haveP) next()
//     else {
//       req.flash('error', "Permission Denied!")
//       res.redirect(req.app.locals.url + "main")
//     }
//   }
// }

// create user admin if not exists
// module.exports.createAdmin = async function (password) {
//   var admin = await UserController.findOne("admin@admin")
//   if (admin == null) {
//     admin = {
//       name: "admin",
//       email: "admin@admin",
//       password: password,
//       type: "1",
//       approved: true,
//     }
//     UserController.createUser(admin)
//       .catch(error => console.log("Admin user not created " + error))
//   }
// }