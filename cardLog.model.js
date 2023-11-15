const mongoose = require('mongoose')

//CardLog schema
const cardLogSchema = new mongoose.Schema({
    userid:
	{
	    type: String,
		required: true
		//required: [true, "Please enter a userid"]
	},

    cardNumber: 
    {
        type: String,
        required: true
        //required: [true, "Please enter a card number"]
    },
    
    cvv:
    {
        type: Number,
        required: true
        //required: [true, "Please enter a cvv"]
    },
    
    expiration:
    {
        type: String,
        required: true
        //required: [true, "Please enter an expiration date"]
    },
    
    bank:
    {
        type: String,
        required: true
        //required: [true, "Please enter bank name"]
    },
    
    firstName:
    {
        type: String,
        required: true
        //required: [true, "Please enter a first name"]
    },
    
    lastName:
    {
        type: String,
        required: true
        //required: [true, "Please enter a last name"]
    },
    
    zip:
    {
        type: Number,
        required: false
    },
    
    billingAddress:
    {
        type: String,
        required: false
    }
})

//Export the general model
const CardLog = mongoose.model("CardLog", cardLogSchema);
module.exports = CardLog;