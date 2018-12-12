var mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String, 
    roomateID: String,
    amountOwed: Number
})

module.exports = mongoose.model('User', userSchema)