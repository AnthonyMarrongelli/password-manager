const express = require('express')
const bcryptjs = require('bcryptjs')                        //Hashing algorithm
const User = require('../models/user.model.js')
const customError = require('../util/customError.js');      //For handling custom errors
const userVerification = require('../util/userVerification.js');        //For verifying the user
const jwt = require('jsonwebtoken');                        //For creating the session cookie


//Creates the router
const router = express.Router();


/* ----------Verify Email API---------- */
// Set this user as a validated user if their link key matches their saved key
router.get('/verify/:id/:verificationKey', async (request, response, next) => { //User is verified in verifyUser before API does anything
    try {
        // Look up the user
        const passedID = request.params.id;
        const currentUser = await User.findById({"_id": passedID});

        // User exists
        if(currentUser) {
            // Keys matched
            if(bcryptjs.compareSync(request.params.verificationKey, currentUser.emailKey)) {
                
                // Verify the user by updating their "verified" field
                await User.findByIdAndUpdate(passedID, {$set: {verified: true}});

                // Send out response
                response
                    .status(200) // 200 is successful response code
                    .json({
                        message: "User verified! Redirecting to Home page..."
                    });
                    

                console.log("Verified!");

            // Keys did not match
            } else return next(customError.errorHandler(401, 'Bad link')); //Send out cutom error

        // User does not exist
        } else return next(customError.errorHandler(404, 'This user does not exist!')); //Send out cutom error

    // Catch try block errors
    } catch(error) { next(error); }

});

module.exports = router;
