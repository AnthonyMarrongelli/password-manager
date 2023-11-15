const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth.route.js')
const userRouter = require('./routes/user.route.js')
const noteRouter = require('./routes/note.route.js')
const cardRouter = require('./routes/card.route.js')
const passRouter = require('./routes/pass.route.js')

main().catch(err => console.log(err));

async function main() {
	/* ----------Connect to Database---------- */
	//Connect to the server and act based on the reported status
	await mongoose.connect("mongodb+srv://fletch:rALCoov62gI14u3p@mern.r768fge.mongodb.net/mern?retryWrites=true&w=majority");
	const db = mongoose.createConnection("mongodb+srv://fletch:rALCoov62gI14u3p@mern.r768fge.mongodb.net/mern?retryWrites=true&w=majority")

		db.on('error', console.error.bind(console, "Connection error:"))

		db.on('close', function callback () {
			console.log("Server connection closed.")
		})

		db.once('open', async function callback () {
			console.log("Connected to server.")
		})


	/* ----------Configure Application---------- */
	//Create the application
	const app = express();

	//Specify format
	app.use(express.json());
	app.use(cookieParser());

	//Watch a port
	app.listen(3005, () => {
		console.log('Server is running on port 3005');
	});


	/* ----------API Routes---------- */
	// Endpoints relating to user credentials
	app.use("/server/auth", authRouter);
	app.use("/server/user", userRouter);
	app.use("/server/note", noteRouter);
	app.use("/server/card", cardRouter);
	app.use("/server/pass", passRouter);


	/* ----------Middleware---------- */
	//Master function to deal with errors in all the API routes instead of dealing with them on a per function basis
	app.use((err, request, response, next) => {
		const statusCode = err.statusCode || 500; 					//Get the status from the error, or use a generic one
		const message = err.message || 'Internal Server Error!'; 	//Get the message from the error, or use a generic one

		//Return the error is a JSON
		return response.status(statusCode).json({
			success: false,
			statusCode,
			message,
		})
	});

	// How to add new field (simple example)
	
	/*
	const n = new UserLoginModel({
		userid: 0,
		email: "test@example.com",
		password: "123",
	})
	
	await n.save()
	*/

	// Closes the connection to DB instead of relying on timeout
	db.close()
}
