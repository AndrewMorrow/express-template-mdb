import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Token from "../models/Token.model.js";
import sendEmail from "../utils/email/sendEmail.js";
import crypto from "crypto";
import { createError } from "../middleware/customErrorHandler.js";
const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL;
dotenv.config();

// @Desc    Register new user
// @Route   /api/auth/register
// @Access  Public
export const register = async (firstName, lastName, email, password) => {
    firstName.trim();
    lastName.trim();
    email.trim();
    password.trim();
    // check db for user
    const dbUser = await User.findOne({ email });
    // check if user exists
    if (dbUser) {
        // const error = { email: "Email Already Exists" };
        // const err = new Error("User Error");
        // err.errors = error;
        // err.statusCode = 409;

        const error = createError(
            "User Error",
            "email",
            "Email Already Exists",
            409
        );
        throw error;
    }

    const newUser = new User({
        firstName,
        lastName,
        email,
        password,
    });

    // save user
    const user = await newUser.save();

    const payload = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
    };

    // sign token once registered
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 31556926,
    });

    user.password = undefined;

    return { success: true, token: `Bearer ${token}`, user };
};

// @Desc    Login existing user
// @Route   /api/auth/login
// @Access  Public
export const login = async (email, password) => {
    email.trim();
    password.trim();
    // check db for user
    const user = await User.findOne({ email });
    if (!user) {
        // throw custom error
        const error = createError(
            "Invalid Payload",
            "login",
            "Invalid email or password",
            401
        );
        throw error;
    }

    // check password against db password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        // throw custom error
        const error = createError(
            "Invalid Payload",
            "user",
            "Invalid email or password",
            401
        );
        throw error;
    }

    const payload = {
        id: user.id,
        name: user.firstName,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 31556926,
    });

    // return signed token
    return {
        token: `Bearer ${token}`,
        success: true,
    };
};

export const requestPasswordReset = async (email) => {
    // check db for user
    const user = await User.findOne({ email });
    if (!user) {
        // throw custom error
        const error = createError(
            "Invalid Payload",
            "user",
            "User does not exist",
            409
        );
        throw error;
    }

    // check if token already exists
    let token = await Token.findOne({ userId: user._id });
    // delete token if exist
    if (token) await token.deleteOne();

    // generate new token
    let resetToken = crypto.randomBytes(32).toString("hex");
    // hash token before saving
    const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

    await new Token({
        userId: user._id,
        token: hash,
        createdAt: Date.now(),
    }).save();

    // create reset link
    const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;

    sendEmail(
        user.email,
        "Password Reset Request",
        { name: user.firstName, link: link },
        "./template/requestResetPassword.handlebars"
    );

    return link;
};

export const resetPassword = async (userId, token, password) => {
    // check for password token
    let passwordResetToken = await Token.findOne({ userId });
    if (!passwordResetToken) {
        const error = createError(
            "Invalid Token",
            "token",
            "Invalid or expired password reset token",
            401
        );
        throw error;
    }

    // compare token to stored token
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
        const error = createError(
            "Invalid Token",
            "token",
            "Invalid or expired password reset token",
            401
        );
        throw error;
    }

    // hash new password and update user
    const hash = await bcrypt.hash(password, Number(bcryptSalt));
    await User.updateOne(
        { _id: userId },
        { $set: { password: hash } },
        { new: true }
    );

    // find user and send success email
    const user = await User.findById({ _id: userId });
    sendEmail(
        user.email,
        "Password Reset Successfully",
        {
            name: user.firstName,
        },
        "./template/resetPassword.handlebars"
    );
    await passwordResetToken.deleteOne();

    return true;
};
