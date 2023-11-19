const express = require('express')
const CardLog = require('../models/cardLog.model.js')
const User = require('../models/user.model.js')                     //Need this because we use verifyUser from userVerification
const customError = require('../util/customError.js');              //For handling custom errors
const userVerification = require('../util/userVerification.js');    //For checking the current user against their session cookie

//Creates the router
const router = express.Router();

/* ----------Create API---------- */
//Create a new card entry and store it in the db
router.post('/create', async (request, response, next) => {

    console.log("Storing new card entry.........");

    //Collate data
    const { userid, cardNumber, cvv, expiration, bank, firstName, lastName, zip, billingAddress } = request.body;
    
    //Add the card to the db
    const newCard = new CardLog({userid, cardNumber, cvv, expiration, bank, firstName, lastName, zip, billingAddress});
    try {
        await newCard.save(); //Save inside the DB
        response.status(201).json("Card stored!"); // 201 means something was created
        console.log("Card stored!");
    
    } catch(error) {
       next(error); //Pass error to the middleware
    }
});

/* ----------Update API---------- */
// First verify the user, then update the requested informaiton by changing the respective fields in the database
router.post('/update/:id', userVerification.verifyUser, async (request, response, next) => { //User is verified in verifyUser before API does anything
    // Check for agreement in user and card owner
    if(request.currentUser.userid !== request.body.userid) return next(customError.errorHandler(401, 'Insufficient authorization required for execution!'));

    console.log("Updating your card log.........");

    try {

        //Update the card with the specified alterations
        const updatedCard = await CardLog.findByIdAndUpdate(request.params.id, {
            //Prevent updating protected information by limiting what may be changed
            $set: {
                cardNumber: request.body.cardNumber,
                cvv: request.body.cvv,
                expiration: request.body.expiration,
                bank: request.body.bank,
                firstName: request.body.firstName,
                lastName: request.body.lastName,
                zip: request.body.zip,
                billingAddress: request.body.billingAddress
            }
        }, {new: true}) //new: true specifies that the updated info should be returned, rather than the original info

        //Return the updated card
        response
            .status(200) // 200 is successful response code
            .json(updatedCard);

        console.log("Card Updated Successfully!");

    } catch(error) {
        next(error);
    }

});


/* ----------Delete API---------- */
// Delete the specified card
router.delete('/delete/:id', userVerification.verifyUser, async (request, response, next) => { //User is verified in verifyUser before API does anything
    // Check for agreement in user between the request and the session cookie
    if(request.currentUser.userid !== request.body.userid) return next(customError.errorHandler(401, 'Insufficient authorization required for execution!'));

    console.log("Deleting your card information...");

    try {

        await CardLog.findByIdAndDelete(request.params.id);

        //Report card deletion
        response
            .status(200) // 200 is successful response code
            .json('This card has been deleted...');

        console.log("This card has been deleted...");

    } catch(error) {
        next(error);
    }

});

/* ----------List API---------- */
// Return all card logs that belong to the specified user
router.get('/list/:id', userVerification.verifyUser, async (request, response, next) => { //User is verified in verifyUser before API does anything
    // Check for agreement in user between the request and the session cookie
    if(request.currentUser.userid !== request.params.id) return next(customError.errorHandler(401, 'Insufficient authorization required for execution!'));

    console.log("Fetching the user's card logs...");

    try {

        // Get the search term if it exists (should be as such /server/card/list/id:...?keyword=...)
        const keyword = request.query.keyword || '';

        const cardList = await CardLog.find({
            userid: request.params.id,
            cardNumber: {$regex: keyword, $options: 'i'} // cardNumber contians the keyword somewhere as a substring. Non-case-sesitive
        });

        //Respond with the collection of card logs 
        response
            .status(200) // 200 is successful response code
            .json(cardList);

        console.log("Card logs retrieved successfully!");

    } catch(error) {
        next(error);
    }

});


module.exports = router;
