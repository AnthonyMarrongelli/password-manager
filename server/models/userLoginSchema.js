const mongoose = require('mongoose')

//user_login schema
const userLoginSchema = new mongoose.Schema({
	userid:
	{
		type: Number,
		required: true
		//required: [true, "Please enter a userid"]
	},
	email: 
	{
		type: String,
        required: true
	    //required: [true, "Please enter a email"]
	},
	password: 
	{
		type: String,
        required: true
		//required: [true, "Please enter a password"]
	},
	username: 
	{
		type: String,
		required: false
	}
})

//creating model for db
const UserLoginModel = db.model("user_logins", userLoginSchema)

//export
module.exports = UserLoginModel