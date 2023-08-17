const Post = require('../models/PostModel');
const apiResponse = require('../helpers/apiResponse');
const User = require("../models/UserModel");

exports.create = async (req, res) => {
    try {
        // destructure name, email, password from req.body
        const {title, content, photo} = req.body;

        // Find the login user
        // const user = await User.findById(req.user._id);

        // check if title is taken
        const existingUser = await Post.findOne({title});

        if (existingUser) {
            return apiResponse.ErrorResponse(res, "Title is already taken");
        }

        // Create Post
        const post = await new Post({
            title,
            content,
            photo,
            author: req.user._id
        }).save();

        // send response
        if (post) {
            return apiResponse.successResponse(res, 'Post Create Successful!');
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message);
    }
};

exports.list = async (req, res) => {
    try {
        const post = await Post.find()
            .populate("author");
        if (post) {
            return apiResponse.successResponseWithData(res, 'Post get Successful!', post);
        }
    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message);
    }
};

exports.read = async (req, res) => {
    try {
        const id = req.params.id;
        const post = await Post.findById(id).populate("author");
        if (post) {
            return apiResponse.successResponseWithData(res, 'Post get Successful!', post);
        }
    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message);
    }
};

exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const {title, content} = req.body;
        const post = await Post.findById(id);


        const updated = await Post.findByIdAndUpdate(
            id,
            {
                title: title || post['title'],
                content: content || post['content']
            },
            {new: true}
        );
        await updated.save()
        // send response
        return apiResponse.successResponse(res, 'Update Successful!');
    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message);
    }
};

exports.remove = async (req, res) => {
    try {
        const id = req.params.id;
        const post = await Post.findByIdAndDelete(id);
        if (post) {
            return apiResponse.successResponse(res, 'Post Remove Successful!');
        }
    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message);
    }
};

exports.postByAuthor = async (req, res) => {
    try {
        // Find the login user
        const author = await User.findById(req.user._id);
        const post = await Post.find({author}).populate("author");
        if (post) {
            return apiResponse.successResponseWithData(res, 'Post get Successful!', post);
        }
    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message);
    }
};
