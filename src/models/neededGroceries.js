var mongoose = require('mongoose')

const Schema = mongoose.Schema

const grocerySchema = new Schema({
    name: String,
    cost: Number,
    purchaser: String,
    addedBy: String
})

module.exports = mongoose.model('Needed', grocerySchema)