const express = require('express')
const CardLog = require('../models/cardLog.model.js') //Pls have .js here
const User = require('../models/user.model.js')             //Pls have .js here
const customError = require('../util/customError.js');   //For handling custom errors
const userVerification = require('../util/userVerification.js');   //For handling custom errors

//Creates the router
const router = express.Router();

/* ----------Create API---------- */
//Create a new card entry and store it in the db
router.post('/create', async (request, response, next) => { //next arg lets us use the middware
    //Information we get from the browser
    console.log(request.body);
    console.log("Storing.........");

    //Collate data
    const { userid, cardNumber, cvv, expiration, bank, firstName, lastName, zip, billingAddress } = request.body;
    
    //Add the card to the db
    const newCard = new CardLog({userid, cardNumber, cvv, expiration, bank, firstName, lastName, zip, billingAddress});
    try {
        await newCard.save(); //Save inside the DB. Await keeps us here until task complete
        response.status(201).json("Card stored!"); // 201 means something was created
        console.log("Card stored!");
    
    } catch(error) {
       next(error); //Pass error to the middleware
    }
});

/* ----------Update API---------- */
// First verify the user, then update the requested informaiton by changing the respective fields in the database
router.post('/update/:id', userVerification.verifyUser, async (request, response, next) => { //User if verified in verifyUser before API does anything
    // Check for agreement in user and card owner
    if(request.currentUser.userid !== request.body.userid) return next(customError.errorHandler(401, 'Insufficient authorization required for execution!'));

    try {

        //Update the card with the specified alterations
        const updatedCard = await CardLog.findByIdAndUpdate(request.params.id, {
            //Prevent updating protected information
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
        }, {new: true}) //new: true specifies that the updated info should be returned

        //Return the updated card
        response
            .status(200) // 200 is successful response code
            .json(updatedCard);

        console.log("Updated Successfully!");

    } catch(error) {
        next(error);
    }

});


/* ----------Delete API---------- */
//...


module.exports = router;
