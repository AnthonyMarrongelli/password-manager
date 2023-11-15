const express = require('express')
const PasswordLog = require('../models/passwordLog.model.js') //Pls have .js here
const User = require('../models/user.model.js')             //Pls have .js here
const customError = require('../util/customError.js');   //For handling custom errors
const userVerification = require('../util/userVerification.js');   //For handling custom errors

//Creates the router
const router = express.Router();

/* ----------Create API---------- */
//Create a new password and store it in the db
router.post('/create', async (request, response, next) => { //next arg lets us use the middware
    //Information we get from the browser
    console.log(request.body);
    console.log("Storing.........");

    //Collate data
    const { userid, username, password, application } = request.body;
    
    //Add the password to the db
    const newPassword = new PasswordLog({userid, username, password, application});
    try {
        await newPassword.save(); //Save inside the DB. Await keeps us here until task complete
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

        console.log("Updated Successfully!");

    } catch(error) {
        next(error);
    }

});


/* ----------Delete API---------- */
//...


module.exports = router;
