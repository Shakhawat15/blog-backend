const jwt = require("jsonwebtoken");
const apiResponse = require('../helpers/apiResponse');
const User = require('../models/UserModel');

exports.auth = (req, res, next) => {
    try {
        const decoded = jwt.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );

        req.user = decoded;
        next();
    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message);
    }
};

exports.isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (user['role'] !== 1) {
            return apiResponse.unauthorizedResponse(res, 'You are not permitted!')
        } else {
            next();
        }
    } catch (err) {
        console.log(err);
    }
};
