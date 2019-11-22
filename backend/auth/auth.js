var passport = require("passport")
var localStrategy = require("passport-local").Strategy
var UserController = require("../controllers/user")

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

// Token Verification
var JWTstrategy = require("passport-jwt").Strategy
var ExtractJWT = require("passport-jwt").ExtractJwt
var jwt = require("jsonwebtoken")
var fs = require("fs")

passport.use("jwt", new JWTstrategy({
  secretOrKey: fs.readFileSync("./auth/public.key", "utf8"),
  algorithms: ["RS256"],
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
}, async (token, done) => {
  try {
    return done(null, token.user)
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
  expiresIn: '10m',
  algorithm: "RS256"
}

// Generates token with userInfo
module.exports.genToken = function(userInfo){
  var privateKey = fs.readFileSync("./auth/private.key", "utf8")
  var token = jwt.sign({user: userInfo}, privateKey, tokenOptions)
  return token
}


