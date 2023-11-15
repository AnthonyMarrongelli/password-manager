const express = require('express')
const SecureNote = require('../models/secureNote.model.js') //Pls have .js here
const User = require('../models/user.model.js')             //Pls have .js here
const customError = require('../util/customError.js');   //For handling custom errors
const userVerification = require('../util/userVerification.js');   //For handling custom errors

//Creates the router
const router = express.Router();

/* ----------Create API---------- */
//Create a new Secure Note and store it in the db
router.post('/create', async (request, response, next) => { //next arg lets us use the middware
    //Information we get from the browser
    console.log(request.body);
    console.log("Creating.........");

    //Collate data
    const { userid, title, text } = request.body;
    
    //Add user to the db
    const newSecureNote = new SecureNote({userid, title, text});
    try {
        await newSecureNote.save(); //Save inside the DB. Await keeps us here until task complete
        response.status(201).json("Note created!"); // 201 means something was created
        console.log("Note created!");
    
    } catch(error) {
       next(error); //Pass error to the middleware
    }
});

/* ----------Update API---------- */
// First verify the user, then update the requested informaiton by changing the respective fields in the database
router.post('/update/:id', userVerification.verifyUser, async (request, response, next) => { //User if verified in verifyUser before API does anything
    // Check for agreement in user and note owner
    if(request.currentUser.userid !== request.body.userid) return next(customError.errorHandler(401, 'Insufficient authorization required for execution!'));

    try {

        //Update the note with the specified alterations
        const updatedNote = await SecureNote.findByIdAndUpdate(request.params.id, {
            //Prevent updating protected information
            $set: {
                title: request.body.title,
                text: request.body.text,
            }
        }, {new: true}) //new: true specifies that the updated info should be returned

        //Return the updated note
        response
            .status(200) // 200 is successful response code
            .json(updatedNote);

        console.log("Updated Successfully!");

    } catch(error) {
        next(error);
    }

});


/* ----------Delete API---------- */
//...


module.exports = router;
