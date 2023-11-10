const mongoose = require('mongoose')

// card_log schema
const cardLogSchema = new mongoose.Schema({
    userid:
    {
        type: Number,
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
    },
})

//creating model for db
const CardLogModel = db.model("card_log", cardLogSchema)

//export
module.exports = CardLogModel