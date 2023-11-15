const express = require('express')
const SecureNote = require('../models/secureNote.model.js')
const User = require('../models/user.model.js')                     //Need this because we use verifyUser from userVerification
const customError = require('../util/customError.js');              //For handling custom errors
const userVerification = require('../util/userVerification.js');    //For checking the current user against their session cookie

//Creates the router
const router = express.Router();

/* ----------Create API---------- */
//Create a new Secure Note and store it in the db
router.post('/create', async (request, response, next) => {

    console.log("Storing new note.........");

    //Collate data
    const { userid, title, text } = request.body;
    
    //Add user to the db
    const newSecureNote = new SecureNote({userid, title, text});
    try {
        await newSecureNote.save(); //Save inside the DB
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

    console.log("Updating your note.........");

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

        console.log("Secure Note Updated Successfully!");

    } catch(error) {
        next(error);
    }

});


/* ----------Delete API---------- */
// Delete the specified note
router.delete('/delete/:id', userVerification.verifyUser, async (request, response, next) => { //User is verified in verifyUser before API does anything
    // Check for agreement in user between the request and the session cookie
    if(request.currentUser.userid !== request.body.userid) return next(customError.errorHandler(401, 'Insufficient authorization required for execution!'));

    console.log("Deleting your note...");

    try {

        await SecureNote.findByIdAndDelete(request.params.id);

        //Report note deletion
        response
            .status(200) // 200 is successful response code
            .json('This secure note has been deleted...');

        console.log("This secure note has been deleted...");

    } catch(error) {
        next(error);
    }

});

/* ----------List API---------- */
// Return all notes that belong to the specified user
router.get('/list/:id', userVerification.verifyUser, async (request, response, next) => { //User is verified in verifyUser before API does anything
    // Check for agreement in user between the request and the session cookie
    if(request.currentUser.userid !== request.params.id) return next(customError.errorHandler(401, 'Insufficient authorization required for execution!'));

    console.log("Fetching the user's secure notes...");

    try {
        // Get the search term if it exists (should be as such /server/note/list/id:...?keyword=...)
        const keyword = request.query.keyword || '';

        const noteList = await SecureNote.find({
            userid: request.params.id,
            title: {$regex: keyword, $options: 'i'} // Title contians the keyword somewhere as a substring. Non-case-sesitive
        });

        //Respond with the collection of notes 
        response
            .status(200) // 200 is successful response code
            .json(noteList);

        console.log("Notes retrieved successfully!");

    } catch(error) {
        next(error);
    }

});


module.exports = router;
