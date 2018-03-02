var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
//provided by passport jwt
//provides us a way of configuring the passport
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

//our file 
var config = require('./config');
//adds authenticate to user
exports.local = passport.use(new LocalStrategy(User.authenticate()));

//still using sessions to track users in our application 
//we need to serialize and deserialize our users 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//user is a json object
exports.getToken = function(user) {
	//creates the jwt object
	//user is the payload
	//secret key creates the signature 
	//3rd parameter is some options
	return jwt.sign(user, config.secretKey, 
		{expiresIn: 3600});
};

//options for the jwt based strategy
var opts = {};
//this is how we will specify how it will be extracted 
//supports different methods for extracting information 
//ex fromAuthHeader fromBodyField fromExtractors fromHeader....
//we have been using an authentication header in other methods
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

//second parameter 
//helps supply the secret key to be usedin the strategy 
opts.secretOrKey = config.secretKey;

//json web token passport strategy
//we pass verify function as second parameter
// into our JwtStrategy instantiation
//when the function is called, the done is the callback provided 
//by passport. Through done we can pass back information to pasport
exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done) =>{
	console.log("JWT payload: ", jwt_payload);
	//searching for user with the given id
	User.findOne({_id: jwt_payload._id}, (err, user) => {
		//if there is an error
		if (err) {
			//done can take 3 parameters (info is the third parameter)
			//second is whether user exists 
			//done is the callback to be passed into our strategy
			return done(error, false);
		}
		//if the user is not null
		else if (user) {
			return done(null, user);
		}
		//if the user does not exist
		else {
			return done(null, false);
		}

	});
}));

exports.verifyAdmin = function (req, res, next) {
	if(!req.user.admin) {

	  var err = new Error('You are not authorized to perform this operation!');
	  //settting header in response
	  err.status = 403;
	  return next(err);
	}
  	else {
      return;
    }
};

//not creating sessions, we are using token based authentication
//specifying the strategy as jwt 
exports.verifyUser = passport.authenticate ('jwt', {session: false});