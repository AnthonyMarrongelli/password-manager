const mongoose = require('mongoose')

//PasswordLog schema
const passwordLogSchema = new mongoose.Schema({
    userid:
	{
	    type: Number,
		required: true
		//required: [true, "Please enter a userid"]
	},

    username:
    {
        type: String,
        required: false,
    }, 

    password:
    {
        type: String,
        required: true,
        //required: [true, "Please enter a password"]
    },

    application:
    {
        type: String,
        required: true,
    }
})

//Export the general model
const PasswordLog = mongoose.model("PasswordLog", passwordLogSchema);
module.exports = PasswordLog;