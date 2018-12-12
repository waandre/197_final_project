var mongoose = require('mongoose')

const Schema = mongoose.Schema

const grocerySchema = new Schema({
    name: String,
    cost: Number,
    purchaser: String,
    datePurchased: Date
})

module.exports = mongoose.model('Grocery', grocerySchema)