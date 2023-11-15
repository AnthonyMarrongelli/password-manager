const mongoose = require('mongoose')

//SecureNote schema
const secureNoteSchema = new mongoose.Schema({
    userid:
	{
	    type: String,
		required: true
		//required: [true, "Please enter a userid"]
	},

    title:
    {
        type: String,
        required: false,
    }, 
   
    text:
    {
        type: String,
        required: true,
        //required: [true, "Please enter a note"]
    }
})

//Export the general model
const SecureNote = mongoose.model("SecureNote", secureNoteSchema);
module.exports = SecureNote;