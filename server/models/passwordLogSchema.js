const mongoose = require('mongoose')

// password_log schema
const passwordLogSchema = new mongoose.Schema({
    userid:
    {
        type: Number,
        required: true
        //required: [true, "Please enter a userid"]
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
    },
    application:
    {
        type: String,
        required: true
    }
})

//creating model for db
const PasswordLogModel = db.model("password_log", passwordLogSchema)

//export
module.exports = PasswordLogModel