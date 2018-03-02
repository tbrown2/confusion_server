//username and password
//admin flag

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

//username and password automatically added into our schema
var User = new Schema ({
	firstname: {
		type: String,
		default: ""
	},
	lastname: {
		type: String,
		default: ""
	},
	admin: {
		type: Boolean,
		default: false
	}
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);