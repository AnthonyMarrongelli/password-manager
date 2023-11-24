const express = require('express')
const bcryptjs = require('bcryptjs')                        //Hashing algorithm
const User = require('../models/user.model.js')
const customError = require('../util/customError.js');      //For handling custom errors
const jwt = require('jsonwebtoken');                        //For creating the session cookie
const brevo = require('@getbrevo/brevo');                   //For email verification
const {v4: uuidv4, v4} = require('uuid');                   //Generate random strings


//Creates the router
const router = express.Router();

/* ----------SignUp API---------- */
//Send signup information API
router.post('/signup', async (request, response, next) => { // Async lets us use await; next arg lets us use the middware

    console.log("Creating a new user.........");

    //Collate data
    const { username, email, password } = request.body;
    const hashedPassword = bcryptjs.hashSync(password, 10); //implicit await. 10 is the salt num
    
    //Add user to the db
    const newUser = new User({username, email, password: hashedPassword, verified: false});
    try {
        await newUser.save(); //Save inside the DB. Await keeps us here until task complete

        //Send the verification email
        sendVerificationEmail(newUser, next);

        response
            .status(201)
            .json({message: "User created!"}); // 201 means something was created
        
        console.log("User created!");
    
    // Catch try block error and pass it to the middleware
    } catch(error) { next(error); }
});


/* ----------SignIn API---------- */
//Check if the user is who they say they are by checking the database for an email match. Compare passwords, and if things check out, log the user in by creating a session cookie for them
router.post('/signin', async (request, response, next) => {

    console.log("Logging in.........");

    //Collate data
    const { email, password } = request.body;
    
    //Authenticate the user
    try {
        //Check if the user exists
        const currentUser = await User.findOne({email});
        if(currentUser) {

            //Compare the password against the stored one
            if(bcryptjs.compareSync(password, currentUser.password)) {

                //Save a session cookie (weeklong lifespan)
                const sessionToken = jwt.sign({userid: currentUser._id}, 'thanatos') //second param is like a salt for the token. should be secret
                
                //Redact the password before returning the user information
                const {password: hashedPassword, ...currentUserSecure} = currentUser._doc;

                response
                    .status(200)
                    .json({
                        user: currentUserSecure,
                        session: sessionToken,
                        message: 'Sign-In Successful! User Object and Session Token returned.'
                    });

                console.log("Sign-In Successful!");

            } else return next(customError.errorHandler(401, 'Incorrect email or password!')); //Send out cutom error

        } else return next(customError.errorHandler(404, 'This user does not exist!')); //Send out cutom error
    
    // Catch try block error and pass it to the middleware
    } catch(error) { next(error); }
});


/* Send Verification Email Function */
// Send the user an email confirmation
const sendVerificationEmail = async ({_id, email, username}, next) => {

    try {
        //Brevo Initialization
        let defaultClient = brevo.ApiClient.instance;
        let apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = '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';

        //Brevo Connection
        let apiInstance = new brevo.TransactionalEmailsApi();
        let sendSmtpEmail = new brevo.SendSmtpEmail();

        //Set up the Email
        const verificationKey = v4() + _id; //Unique string used to verify the user
        sendSmtpEmail.subject = "RetroVault User Confirmation";

        sendSmtpEmail.htmlContent = 
            `<p>Please click the link below to verify your account and begin buffing your security with RetroVault.</p>
            <p><a href=${"http://localhost:3005/server/email/verify/" + _id + "/" + verificationKey}>Verify Me!</a></p>`;

        sendSmtpEmail.sender = 
        {
            "name": "RetroVault",
            "email": "no-reply@retrovault.xyz",
        };
        
        sendSmtpEmail.to =
        [{
            "email": email,
            "name": username,
        }];

        // Save the verification key
        const hashedKey = bcryptjs.hashSync(verificationKey, 10); // Hash the key
        await User.findByIdAndUpdate(_id, {  //Update the user with the specified alterations
            //Prevent updating protected information
            $set: {emailKey: hashedKey}
        });

        // Send the email
        apiInstance.sendTransacEmail(sendSmtpEmail)
        .then(function (data) {
            console.log("Email sent successfully!");
        
        }, function (error) {
            console.error(error);
        });


    // Catch try block errors
    } catch(error) { next(error); }

}

module.exports = router;
