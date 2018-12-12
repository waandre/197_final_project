var mongoose = require('mongoose')

const Schema = mongoose.Schema

const roomateSchema = new Schema({
    members: Array,
    groceryIDs: Array,
    neededIDs: Array,
    billIDs: Array,
    choreIDs: Array
})

module.exports = mongoose.model('Roomate', roomateSchema)