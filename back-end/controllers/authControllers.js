import validateRegisterInput from "../validation/register.js";
import validateLoginInput from "../validation/login.js";
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
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
