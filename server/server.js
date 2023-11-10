const mongoose = require('mongoose')

//importing models for mongo
const CardLogModel = require('./models/cardLogSchema.js')
const PasswordLogModel = require('./models/passwordLogSchema.js')
const SecureNoteModel = require('./models/secureNoteSchema.js')
const UserLoginModel = require('./models/userLoginSchema.js')

main().catch(err => console.log(err));

async function main() {
	// await mongoose.connect("[REDACTED URL")
	const db = mongoose.createConnection("[REDACTED URL]")

	db.on('error', console.error.bind(console, "connection error:"))

	db.on('close', function callback () {
		console.log("Server connection closed.")
	})

	db.once('open', async function callback () {
		console.log("Connected to server (hopefully)")
	})


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
