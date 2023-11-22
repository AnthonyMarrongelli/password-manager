const express = require('express')
const bcryptjs = require('bcryptjs')                        //Hashing algorithm
const User = require('../models/user.model.js')
const customError = require('../util/customError.js');      //For handling custom errors
const userVerification = require('../util/userVerification.js');        //For verifying the user
const brevo = require('@getbrevo/brevo');                   //For email verification
const {v4: uuidv4, v4} = require('uuid');      //Generate random strings
const jwt = require('jsonwebtoken');                        //For creating the session cookie


//Creates the router
const router = express.Router();

/* ----------Send Email API---------- */
// Send the user an email confirmation
router.post('/send/:id', userVerification.verifyUser, async (request, response, next) => { //User is verified in verifyUser before API does anything
    // Check for agreement in user and note owner
    if(request.currentUser.userid !== request.params.id) return next(customError.errorHandler(401, 'Insufficient authorization required for execution!'));

    try {
        //Brevo Initialization
        let defaultClient = brevo.ApiClient.instance;
        let apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_CON;

        //Brevo Connection
        let apiInstance = new brevo.TransactionalEmailsApi();
        let sendSmtpEmail = new brevo.SendSmtpEmail();

        //Set up the Email
        const verificationKey = v4() + request.currentUser.userid; //Unique string used to verify the user
        sendSmtpEmail.subject = "RetroVault User Confirmation";

        sendSmtpEmail.htmlContent = 
            `<p>Please click the link below to verify your account and begin buffing your security with RetroVault.</p>
            <p><a href=${"http://localhost:3005/server/email/verify/" + request.currentUser.userid + "/" + verificationKey}>Verify Me!</a></p>`;

        sendSmtpEmail.sender = 
        {
            "name": "RetroVault",
            "email": "no-reply@retrovault.xyz",
        };
        
        sendSmtpEmail.to =
        [{
            "email": request.body.email,
            "name": request.body.username,
        }];

        // Save the verification key
        const hashedKey = bcryptjs.hashSync(verificationKey, 10); // Hash the key
        const updatedUser = await User.findByIdAndUpdate(request.params.id, {  //Update the user with the specified alterations
            //Prevent updating protected information
            $set: {emailKey: hashedKey}
        });


        // Send the email
        apiInstance.sendTransacEmail(sendSmtpEmail)
        .then(function (data) {
            console.log("Code: " + verificationKey);
        
        }, function (error) {
            console.error(error);
        });

        //Return the updated user
        const {password: pass, ...currentUserUpdated} = updatedUser._doc;
        response
            .status(200) // 200 is successful response code
            .json(currentUserUpdated);

        console.log("Email sent successfully!");


    
    } catch(error) {
        next(error);
    }

});


/* ----------Verify Email API---------- */
// Set this user as a validated user if their link key matches their saved key
router.get('/verify/:id/:verificationKey', userVerification.verifyUser, async (request, response, next) => { //User is verified in verifyUser before API does anything
    // Check for agreement in user and note owner
    if(request.currentUser.userid !== request.params.id) return next(customError.errorHandler(401, 'Insufficient authorization required for execution!'));

    //Check that the user has logged in before
    const cookie = request.cookies.session;
    if (!cookie) return next(customError.errorHandler(404, 'Log in and try again!')); //Send out cutom error

    try {

        // Get stored key
        const storedData = jwt.verify(cookie, 'thanatos');
        const storedID = storedData.userid;
        const currentUser = await User.findById({"_id": storedID});

        if(currentUser) {
            //Keys matched
            if(bcryptjs.compareSync(request.params.verificationKey, currentUser.emailKey)) {
                
                // Verify the user
                const updatedUser = await User.findByIdAndUpdate(storedID, {  //Update the user with the specified alterations
                    //Prevent updating protected information
                    $set: {verified: true}
                });

                //Send out response
                response
                    .status(200) // 200 is successful response code
                    .json(updatedUser);

                console.log("Verified!");

            //Keys did not match
            } else return next(customError.errorHandler(401, 'Bad link or Signed Out')); //Send out cutom error

        } else return next(customError.errorHandler(404, 'This user does not exist!')); //Send out cutom error

    
    } catch(error) {
        next(error);
    }

});

module.exports = router;
