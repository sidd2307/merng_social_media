const { AuthenticationError } = require('apollo-server')
const { UserInputError } = require('apollo-server')

const Post = require('../../models/Post')
const checkAuth = require('../../util/checkAuth')

module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find().sort({ createdAt: -1 })
                return posts
            } catch (error) {
                throw new Error(err)
            }
        },
        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId)
                if (post) {
                    return post
                } else {
                    throw new Error('Post not found!')
                }
            } catch (error) {
                throw new Error(error)
            }
        }
    },
    Mutation: {
        async createPost(_, { body }, context) {
            //user must login, send token in header, we decode it...if he is authorised then only we allow the post
            const user = checkAuth(context)
            console.log(user)

            if(body.trim() === ''){
                throw new Error('Post body must not be empty!')
            }

            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })

            const post = await newPost.save()

            return post
        },
        async deletePost(_, { postId }, context) {
            const user = checkAuth(context)

            //ensure this user is creator of the post...
            try {
                const post = await Post.findById(postId)
                if (user.username === post.username) {
                    await post.delete()
                    return 'Post deleted successfully'
                }
                else {
                    throw new AuthenticationError('Action not allowed')
                }
            } catch (error) {
                throw new Error(error)
            }
        },
        async likePost(_, { postId }, context) {
            const { username } = checkAuth(context)

            const post = await Post.findById(postId)

            if (post) {
                if (post.likes.find(like => like.username === username)) {
                    //post already liked, unlike it
                    post.likes = post.likes.filter(like => like.username !== username)
                } else {
                    //not liked, like it
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }
                await post.save()
                return post
            } else {
                throw new UserInputError('Post not found')
            }
        }
    }
}