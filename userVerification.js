/* Verify the session cookie and current user match */

const jwt = require('jsonwebtoken');                     //For cookie operations
const customError = require('../util/customError.js');   //For handling custom errors

const verifyUser = (request, response, next) => {
    const sessionToken = request.cookies.session; //Get the user's session cookie

    //Verify the token
    if(sessionToken) {
        jwt.verify(sessionToken, process.env.SECRET_KEY, (err, currentUser) => {
            if (err) return next(customError.errorHandler(401, 'Unauthorized!'));

            request.currentUser = currentUser;
            next();
        })

    } else return next(customError.errorHandler(404, 'Session cookie not found!'));

}


exports.verifyUser = verifyUser;