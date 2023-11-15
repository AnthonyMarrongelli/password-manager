const express = require('express')
const User = require('../models/user.model.js')             //Pls have .js here
const customError = require('../util/customError.js');   //For handling custom errors
const userVerification = require('../util/userVerification.js');   //For handling custom errors
const bcryptjs = require('bcryptjs')                        //Hashing algorithm

//Creates the router
const router = express.Router();

/* ----------Update API---------- */
// First verify the user, then update the requested informaiton by changing the respective fields in the database
router.post('/update/:id', userVerification.verifyUser, async (request, response, next) => { //User if verified in verifyUser before API does anything
    // Check for agreement in user between the request and the session cookie
    if(request.currentUser.userid !== request.params.id) return next(customError.errorHandler(404, 'This user does not exist!'));

    try {

        //If the password was updated, encrypt it
        if(request.body.password) request.body.password = bcryptjs.hashSync(request.body.password, 10);


        //Update the user with the specified alterations
        const updatedUser = await User.findByIdAndUpdate(request.params.id, {
            //Prevent updating protected information
            $set: {
                username: request.body.username,
                email: request.body.email,
                password: request.body.password,
            }
        }, {new: true}) //new: true specifies that the updated info should be returned

        //Return the updated user
        const {password: pass, ...currentUserUpdated} = updatedUser._doc;
        response
            .status(200) // 200 is successful response code
            .json(currentUserUpdated);

        console.log("Updated Successfully!");

    } catch(error) {
        next(error);
    }

});

/* ----------Delete API---------- */
//...

module.exports = router;
