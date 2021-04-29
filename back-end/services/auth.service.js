import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Token from "../models/Token.model.js";
import sendEmail from "../utils/email/sendEmail.js";
import crypto from "crypto";
const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL;
dotenv.config();

// @Desc    Register new user
// @Route   /api/auth/register
// @Access  Public
export const register = async (firstName, lastName, email, password) => {
    return new Promise(async (resolve, reject) => {
        // check db for user
        const dbUser = await User.findOne({ email });
        // check if user exists
        if (dbUser) {
            const err = new Error("Email already exists");
            err.statusCode = 409;
            return reject(err);
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
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 31556926 },
            (err, token) => {
                if (err) {
                    return res.status(400).json({
                        tokenerror:
                            "There was a problem updating your security token",
                    });
                }

                user.password = undefined;

                // send token and user info
                // return res.json({
                //     success: true,
                //     token: `Bearer ${token}`,
                //     user,
                // });
                return resolve({
                    success: true,
                    token: `Bearer ${token}`,
                    user,
                });
            }
        );
    });
};

// @Desc    Login existing user
// @Route   /api/auth/login
// @Access  Public
export const login = async (email, password) => {
    // check db for user
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    // check password against db password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const payload = {
        id: user.id,
        name: user.firstName,
    };

    // sign token
    jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 31556926 },
        (err, token) => {
            if (err) {
                return res.status(400).json({
                    tokenerror:
                        "There was a problem updating your security token",
                });
            }

            // send signed token
            // return res.json({
            //     success: true,
            //     token: `Bearer ${token}`,
            // });
            return {
                success: true,
                token: `Bearer ${token}`,
            };
        }
    );
};

export const requestPasswordReset = async (email) => {
    // const email = req.body.email;

    // check db for user
    const user = await User.findOne({ email });
    if (!user) throw new Error("User does not exist");

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
    // const userId = req.body.user;
    // const token = req.body.token;
    // const password = req.body.password;

    // check for password token
    let passwordResetToken = await Token.findOne({ userId });
    if (!passwordResetToken) {
        throw new Error("Invalid or expired password reset token");
    }

    // compare token to stored token
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
        throw new Error("Invalid or expired password reset token");
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
