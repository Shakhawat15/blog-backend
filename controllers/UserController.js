const User = require("../models/UserModel");
const {hashPassword, comparePassword} = require("../helpers/password");
const jwt = require("jsonwebtoken");
const apiResponse = require('../helpers/apiResponse');


exports.register = async (req, res) => {
    try {
        // destructure name, email, password from req.body
        const {name, email, password, address} = req.body;

        // check if email is taken
        const existingUser = await User.findOne({email});

        if (existingUser) {
            return apiResponse.ErrorResponse(res, "Email is already taken");
        }
        // hash password
        const hashedPassword = await hashPassword(password);
        // register user
        const user = await new User({
            name,
            email,
            password: hashedPassword,
            address
        }).save();

        // send response
        if (user) {
            return apiResponse.successResponse(res, 'Registration Successful!')
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message);
    }
};


exports.login = async (req, res) => {
    try {
        // destructure name, email, password from req.body
        const {email, password} = req.body;

        // check if email is taken
        const user = await User.findOne({email});
        console.log(user)
        if (!user) {
            return apiResponse.ErrorResponse(res, "User not found");
        }
        // compare password
        const match = await comparePassword(password, user.password);

        if (!match) {
            return apiResponse.ErrorResponse(res, "Invalid email or password");
        }
        // create signed jwt
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        const data = {
            name: user['name'],
            email: user['email'],
            role: user['role'],
            address: user['address'],
        }

        // send response
        return apiResponse.successResponseWithDataNToken(res, 'LogIn Successful!', data, token)
    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message);
    }
};


exports.updateProfile = async (req, res) => {
    try {
        const {name, password, address, role} = req.body;
        const user = await User.findById(req.user._id);

        // hash the password
        const hashedPassword = password ? await hashPassword(password) : undefined;

        const updated = await User.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user['name'],
                password: hashedPassword || user['password'],
                address: address || user['address'],
                role: role || user['role']
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

