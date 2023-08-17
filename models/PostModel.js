const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        author: {
            type: ObjectId,
            ref: "User",
            required: true,
        },
        photo: {
            type: String,
            required: true,
        }
    },
    { timestamps: true, versionKey: false }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;