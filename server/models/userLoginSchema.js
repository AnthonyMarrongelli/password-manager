const mongoose = require('mongoose')

//UserLogin schema
const userCredSchema = new mongoose.Schema({
    /*
    userid:
	{
	    type: Number,
		required: true
		//required: [true, "Please enter a userid"]
	},
    */
    username:
    {
        type: String,
        required: false,
    }, 
   
    email:
    {
        type: String,
        required: true,
        //required: [true, "Please enter a email"]
    }, 

    password:
    {
        type: String,
        required: true,
        //required: [true, "Please enter a password"]
    }
})

//Export the general model
const User = mongoose.model("User", userCredSchema);
module.exports = User;