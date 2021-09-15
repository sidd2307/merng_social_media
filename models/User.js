const { model, Schema } = require('mongoose')

const userSchema = new Schema({
    //handle required feature in graphQL layer and not on mongoose layer
    username: String,
    password: String,
    email: String,
    createdAt: String
})

module.exports = model("User", userSchema)