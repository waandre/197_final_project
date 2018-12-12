var mongoose = require('mongoose')

const Schema = mongoose.Schema

const billSchema = new Schema({
    name: String,
    cost: Number,
    purchaser: String,
    datePurchased: Date,
    split: Number
})

module.exports = mongoose.model('Bill', billSchema)