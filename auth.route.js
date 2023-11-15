const express = require('express')
const bcryptjs = require('bcryptjs')                        //Hashing algorithm
const User = require('../models/user.model.js')             //Pls have .js here
const customError = require('../util/customError.js');   //For handling custom errors
const jwt = require('jsonwebtoken');                        //For creating the cookie


//Creates the router
const router = express.Router();

/* ----------SignUp API---------- */
//Send signup information API. Async lets us use await
router.post('/signup', async (request, response, next) => { //next arg lets us use the middware
    //Information we get from the browser
    console.log(request.body);
    console.log("Creating.........");

    //Collate data
    const { username, email, password } = request.body;
    const hashedPassword = bcryptjs.hashSync(password, 10); //implicit await. 10 is the salt num
    
    //Add user to the db
    const newUser = new User({username, email, password: hashedPassword});
    try {
        await newUser.save(); //Save inside the DB. Await keeps us here until task complete
        response.status(201).json("User created!"); // 201 means something was created
        console.log("User created!");
    
    } catch(error) { // Could be duplicate field if we choose to make some value unique like email, or could be some catastrophic error
       next(error); //Pass error to the middleware
    }
});

/* ----------SignIn API---------- */
//Check if the user is who they say they are by checking the database for an email match. Compare passwords, and if things check out, log the user in by creating a session cookie for them
router.post('/signin', async (request, response, next) => {
    //Information we get from the browser
    console.log(request.body);
    console.log("Loading.........");

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
                
                //Redact the password before returning
                const {password: hashedPassword, ...currentUserSecure} = currentUser._doc;

                response
                    .cookie('session', sessionToken, {httpOnly: true, expires: new Date(Date.now() + 604800000)})
                    .status(200)
                    .json(currentUserSecure);

                console.log("Sign-In Successful!");

            } else return next(customError.errorHandler(401, 'Incorrect email or password!')); //Send out cutom error

        } else return next(customError.errorHandler(404, 'This user does not exist!')); //Send out cutom error
    
    } catch(error) { 
       next(error); //Pass error to the middleware
    }
});

/* ----------SignOut API---------- */
// Sign the user out by getting rid of the session cookie
router.get('/signout', async (request, response, next) => {
    
    // End the session
    try {

        //Erase the session cookie
        response.clearCookie('session');

        //Report the logout
        response
            .status(200) // 200 is successful response code
            .json('User has been logged out!');

        console.log("User has been logged out!");

    } catch(error) {
        next(error);
    }
});

module.exports = router;
