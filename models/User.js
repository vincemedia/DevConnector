// This file is responsible for creating the User Schema (column types) for the User collection (table) in the MongoDB database

// this file contains the Schema ('table columns') for the User collection (collection is the name in MongoDB for what usually is called a table in relational databases)
// mongoose is the database abstraction layer that we use to interact with the database.

const mongoose = require('mongoose');

// define the fields available in the Schema for Collection: User
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Make the model available to Mongoose
module.exports = User = mongoose.model('user', UserSchema);
