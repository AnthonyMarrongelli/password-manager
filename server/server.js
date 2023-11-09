const express = require('express')
const { MongoClient } = require('mongodb');


// URL to connect to our database
const url = ''

// Name of our DB
const baseName = ''

// Establishing connection to our databse, 
//      Not entirely sure what useUnifiedTopology is about, but from what I read it has something to do with making sure connection is successful and improves connection/behavior
const client = new MongoClient(url, { useUnifiedTopology: true })

// Initializes connection to DB
client.connect();
