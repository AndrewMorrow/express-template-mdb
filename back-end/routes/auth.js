import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import validateRegisterInput from "../validation/register.js";
import validateLoginInput from "../validation/login.js";

import User from "../models/UserModel.js";

router.post("/register", (req, res) => {
    validateRegisterInput(req.body);

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }).then((user) => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        }

        const newUser = new User({
            name,
            email,
            password,
        });

        bcrypt.genSalt(20, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) {
                    throw err;
                }

                newUser.password = hash;
                newUser
                    .save()
                    .then((user) => {
                        const payload = {
                            id: user.id,
                            name: user.name,
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

                                res.json({
                                    success: true,
                                    token: `Bearer ${token}`,
                                    user,
                                });
                            }
                        );
                        // res.json(user)
                    })
                    .catch((err) => {});
            });
        });
    });
});

router.post("/login", (req, res) => {
    validateLoginInput(req.body);

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }).then((user) => {
        if (!user) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        bcrypt.compare(password, user.password).then((isMatch) => {
            if (!isMatch) {
                return res
                    .status(401)
                    .json({ message: "Invalid email or password" });
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

                    res.json({
                        success: true,
                        token: `Bearer ${token}`,
                    });
                }
            );
        });
    });
});

export default router;
