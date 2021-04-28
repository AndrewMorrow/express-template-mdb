import validateRegisterInput from "../validation/register.js";
import validateLoginInput from "../validation/login.js";
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Token from "../models/Token.model.js";
import sendEmail from "../utils/email/sendEmail.js";
import crypto from "crypto";
const bcryptSalt = process.env.BCRYPT_SALT;
dotenv.config();

// @Desc    Register new user
// @Route   /api/auth/register
// @Access  Public
export const register = (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }).then((user) => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        }
        if (!isValid) {
            return res.status(400).json(errors);
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
        });

        newUser
            .save()
            .then((user) => {
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
                        res.json({
                            success: true,
                            token: `Bearer ${token}`,
                            user,
                        });
                    }
                );
            })
            .catch((err) => {
                return res.status(500).json({ message: err });
            });
    });
};

// @Desc    Login existing user
// @Route   /api/auth/login
// @Access  Public
export const login = async (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const payload = {
        id: user.id,
        name: user.name,
    };

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

            return res.json({
                success: true,
                token: `Bearer ${token}`,
            });
        }
    );
};

export const requestPasswordReset = async (email) => {
    const user = await User.findOne({ email });

    if (!user) throw new Error("User does not exist");
    let token = await Token.findOne({ userId: user._id });
    if (token) await token.deleteOne();
    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

    await new Token({
        userId: user._id,
        token: hash,
        createdAt: Date.now(),
    }).save();

    const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
    sendEmail(
        user.email,
        "Password Reset Request",
        { name: user.name, link: link },
        "./template/requestResetPassword.handlebars"
    );
    return link;
};

export const resetPassword = async (userId, token, password) => {
    let passwordResetToken = await Token.findOne({ userId });
    if (!passwordResetToken) {
        throw new Error("Invalid or expired password reset token");
    }
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
        throw new Error("Invalid or expired password reset token");
    }
    const hash = await bcrypt.hash(password, Number(bcryptSalt));
    await User.updateOne(
        { _id: userId },
        { $set: { password: hash } },
        { new: true }
    );
    const user = await User.findById({ _id: userId });
    sendEmail(
        user.email,
        "Password Reset Successfully",
        {
            name: user.name,
        },
        "./template/resetPassword.handlebars"
    );
    await passwordResetToken.deleteOne();
    return true;
};
