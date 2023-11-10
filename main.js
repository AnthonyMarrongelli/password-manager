const mongoose = require('mongoose')

main().catch(err => console.log(err));

async function main() {
	// await mongoose.connect("mongodb+srv://largeproject23:T6mIXQV2CO7FMkhi@cluster0.o6cf0n2.mongodb.net/?retryWrites=true&w=majority")
	const db = mongoose.createConnection("mongodb+srv://largeproject23:T6mIXQV2CO7FMkhi@cluster0.o6cf0n2.mongodb.net/RetroSecurityManager?retryWrites=true&w=majority")

	db.on('error', console.error.bind(console, "connection error:"))

	db.on('close', function callback () {
		console.log("Server connection closed.")
	})

	db.once('open', async function callback () {
		console.log("Connected to server (hopefully)")
	})

	// user_login schema

	const userLoginSchema = new mongoose.Schema({
		userid:
		{
			type: Number,
			required: true
		},
		email: 
		{
			type: String,
			required: true
		},
		password: 
		{
			type: String,
			required: true
		},
		username: 
		{
			type: String,
			required: false
		}
	})

	// password_log schema

	const passwordLogSchema = new mongoose.Schema({
		userid:
		{
			type: Number,
			required: true
		},
		password: 
		{
			type: String,
			required: true
		},
		username: 
		{
			type: String,
			required: false
		},
		application:
		{
			type: String,
			required: true
		}
	})

	// card_log schema
	
	const cardLogSchema = new mongoose.Schema({
		userid:
		{
			type: Number,
			required: true
		},
		cardNumber: 
		{
			type: String,
			required: true
		},
		cvv:
		{
			type: Number,
			required: true
		},
		expiration:
		{
			type: String,
			required: true
		},
		bank:
		{
			type: String,
			required: true
		},
		firstName:
		{
			type: String,
			required: true
		},
		lastName:
		{
			type: String,
			required: true
		},
		zip:
		{
			type: Number,
			required: false
		},
		billingAddress:
		{
			type: String,
			required: false
		},
	})
	
	// secure_note schema

	const secureNoteSchema = new mongoose.Schema({
		userid:
		{
			type: Number,
			required: true
		},
		title: 
		{
			type: String,
			required: false
		},
		text:
		{
			type: String,
			required: true
		}
	})

	// Various Models

	const UserLoginModel = db.model("user_logins", userLoginSchema)
	const PasswordLogModel = db.model("password_log", passwordLogSchema)
	const CardLogModel = db.model("card_log", cardLogSchema)
	const SecureNoteModel = db.model("secure_note", secureNoteSchema)

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
