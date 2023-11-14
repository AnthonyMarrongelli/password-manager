const express = require('express')
const bcryptjs = require('bcryptjs')            //Hashing algorithm
const User = require('../models/user.model.js') //Pls have .js here

//Creates the router
const router = express.Router();

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

module.exports = router;
