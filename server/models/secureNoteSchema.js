const mongoose = require('mongoose')

// secure_note schema
const secureNoteSchema = new mongoose.Schema({
    userid:
    {
        type: Number,
        required: true
        //required: [true, "Please enter a userid"]
    },
    title: 
    {
        type: String,
        required: false
    },
    text:
    {
        type: String,
        required: true
        //required: [true, "Please enter a note"]
    }
})

//creating model for db
const SecureNoteModel = db.model("secure_note", secureNoteSchema)

//export
module.exports = SecureNoteModel