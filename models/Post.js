const { model, Schema } = require('mongoose')

const postSchema = new Schema({
    body: String,
    username: String,
    createdAt: String,
    //array of comments
    comments: [
        {
            body: String,
            username: String,
            createdAt: String
        }
    ],
    likes: [
        {
            username: String,
            createdAt: String,
        }
    ],
    //automatically opulate users fields if we want to use some mongoose methods.
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
})

module.exports = model("Post", postSchema)