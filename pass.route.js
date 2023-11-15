const express = require('express')
const PasswordLog = require('../models/passwordLog.model.js')
const User = require('../models/user.model.js')                     //Need this because we use verifyUser from userVerification
const customError = require('../util/customError.js');              //For handling custom errors
const userVerification = require('../util/userVerification.js');    //For checking the current user against their session cookie

//Creates the router
const router = express.Router();

/* ----------Create API---------- */
//Create a new password and store it in the db
router.post('/create', async (request, response, next) => {

    console.log("Storing new password entry.........");

    //Collate data
    const { userid, username, password, application } = request.body;
    
    //Add the password to the db
    const newPassword = new PasswordLog({userid, username, password, application});
    try {
        await newPassword.save(); //Save inside the DB
        response.status(201).json("Password stored!"); // 201 means something was created
        console.log("Password stored!");
    
    } catch(error) {
       next(error); //Pass error to the middleware
    }
});

/* ----------Update API---------- */
// First verify the user, then update the requested informaiton by changing the respective fields in the database
router.post('/update/:id', userVerification.verifyUser, async (request, response, next) => { //User if verified in verifyUser before API does anything
    // Check for agreement in user and password log owner
    if(request.currentUser.userid !== request.body.userid) return next(customError.errorHandler(401, 'Insufficient authorization required for execution!'));

    console.log("Updating your password log.........");

    try {

        //Update the password log with the specified alterations
        const updatedPass = await PasswordLog.findByIdAndUpdate(request.params.id, {
            //Prevent updating protected information
            $set: {
                username: request.body.username,
                password: request.body.password,
                application: request.body.application
            }
        }, {new: true}) //new: true specifies that the updated info should be returned

        //Return the updated password log
        response
            .status(200) // 200 is successful response code
            .json(updatedPass);

        console.log("Password Log Updated Successfully!");

    } catch(error) {
        next(error);
    }

});


/* ----------Delete API---------- */
// Delete the specified password
router.delete('/delete/:id', userVerification.verifyUser, async (request, response, next) => { //User is verified in verifyUser before API does anything
    // Check for agreement in user between the request and the session cookie
    if(request.currentUser.userid !== request.body.userid) return next(customError.errorHandler(401, 'Insufficient authorization required for execution!'));

    console.log("Deleting your password log...");

    try {

        await PasswordLog.findByIdAndDelete(request.params.id);

        //Report note deletion
        response
            .status(200) // 200 is successful response code
            .json('This password log has been deleted...');

        console.log("This password log has been deleted...");

    } catch(error) {
        next(error);
    }

});

/* ----------List API---------- */
// Return all password logs that belong to the specified user
router.get('/list/:id', userVerification.verifyUser, async (request, response, next) => { //User is verified in verifyUser before API does anything
    // Check for agreement in user between the request and the session cookie
    if(request.currentUser.userid !== request.params.id) return next(customError.errorHandler(401, 'Insufficient authorization required for execution!'));

    console.log("Fetching the user's password logs...");

    try {

        // Get the search term if it exists (should be as such /server/pass/list/id:...?keyword=...)
        const keyword = request.query.keyword || '';

        const passList = await PasswordLog.find({
            userid: request.params.id,
            application: {$regex: keyword, $options: 'i'} // Application contians the keyword as a substring. Non-case-sesitive
        });

        //Respond with the collection of password logs 
        response
            .status(200) // 200 is successful response code
            .json(passList);

        console.log("Password logs retrieved successfully!");

    } catch(error) {
        next(error);
    }

});


module.exports = router;
