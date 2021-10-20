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

const auth = {
  // @Desc    Register new user
  // @Route   /api/auth/register
  // @Access  Public
  register: async (firstName, lastName, email, password, isAdmin) => {
    const firstNameTrim = firstName.trim();
    const lastNameTrim = lastName.trim();
    const emailTrim = email.trim();
    const passwordTrim = password.trim();

    // check db for user
    const dbUser = await User.findOne({ email: emailTrim });

    // check if user exists
    if (dbUser) {
      const error = createError(
        "User Error",
        "Email address already exists!",
        409
      );
      throw error;
    }

    const newUser = new User({
      firstName: firstNameTrim,
      lastName: lastNameTrim,
      email: emailTrim,
      password: passwordTrim,
      isAdmin: isAdmin ? true : false,
    });

    // save user
    const user = await newUser.save();

    user.password = undefined;

    const token = await auth.login(user.email, passwordTrim);
    return token;
  },

  // @Desc    Login existing user
  // @Route   /api/auth/login
  // @Access  Public
  login: async (email, password) => {
    const emailTrim = email.trim();
    const passTrim = password.trim();

    // check db for user
    const user = await User.findOne({ email: emailTrim });
    if (!user) {
      // throw custom error
      const error = createError(
        "Invalid Payload",
        "Invalid email or password! Please try again.",
        401
      );
      throw error;
    }

    // check password against db password
    const isMatch = await bcrypt.compare(passTrim, user.password);
    if (!isMatch) {
      // throw custom error
      const error = createError(
        "Invalid Payload",
        "Invalid email or password! Please try again.",
        401
      );
      throw error;
    }

    const payload = {
      id: user.id,
      firstName: user.firstName,
    };

    // sign token after verified
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 31556926,
    });

    // return signed token
    return {
      token: `Bearer ${token}`,
      success: true,
    };
  },

  // @Desc    Request User Password Reset
  // @Route   /api/auth/requestReset
  // @Access  Public
  requestPasswordReset: async (email) => {
    // check db for user
    const user = await User.findOne({ email });
    if (!user) {
      // throw custom error
      const error = createError(
        "Invalid Payload",
        "An account with that email does not exist!",
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
  },

  // @Desc    Request User Password Reset
  // @Route   /api/auth/resetPassword
  // @Access  Private
  resetPassword: async (userId, token, password) => {
    // console.log({ userID: userId });
    // console.log({ token: token });
    // console.log({ password: password });
    // check for password token
    let passwordResetToken = await Token.findOne({ userId });
    if (!passwordResetToken) {
      const error = createError(
        "Invalid Token",
        "Invalid or expired password reset token! Please request another one.",
        401
      );
      throw error;
    }

    // compare token to stored token
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
      const error = createError(
        "Invalid Token",
        "Invalid or expired password reset token!",
        401
      );
      throw error;
    }

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
      "Password Reset Successfully!",
      {
        name: user.firstName,
      },
      "./template/resetPassword.handlebars"
    );
    await passwordResetToken.deleteOne();

    return true;
  },

  // @Desc    Request User Password Reset
  // @Route   /api/auth/passwordUpdate
  // @Access  Private
  updatePassword: async (userId, currPass, updatedPass) => {
    const currPassword = currPass.trim();
    const updatedPassword = updatedPass.trim();

    const user = await User.findOne({ _id: userId });
    if (!user) {
      // throw custom error
      const error = createError("Invalid Payload", "User not found!", 401);
      throw error;
    }
    // check password against db password
    const isMatch = await bcrypt.compare(currPassword, user.password);
    if (!isMatch) {
      // throw custom error
      const error = createError(
        "Invalid Payload",
        "Invalid current password!",
        401
      );
      throw error;
    }

    const hash = await bcrypt.hash(updatedPassword, Number(bcryptSalt));
    // update user with new password
    await User.updateOne({ _id: userId }, { password: hash }, { new: true });

    return true;
  },

  // @Desc    Request User Password Reset
  // @Route   /api/auth/updateUser
  // @Access  Private
  updateUser: async (userId, userData) => {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      // throw custom error
      const error = createError("Invalid Payload", "User not found!", 401);
      throw error;
    }

    if (userData.firstName) {
      const firstNameTrim = userData.firstName.trim();
      user.firstName = firstNameTrim;
    }
    if (userData.lastName) {
      const lastNameTrim = userData.lastName.trim();
      user.lastName = lastNameTrim;
    }
    if (userData.email) {
      const emailTrim = userData.email.trim();
      user.email = emailTrim;
    }
    if (userData.password) {
      const passwordTrim = userData.password.trim();
      user.password = passwordTrim;
    }

    // update user with new information
    await user.save();

    const payload = {
      id: user.id,
      firstName: user.firstNameTrim,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 31556926,
    });

    return {
      token: `Bearer ${token}`,
      success: true,
      message: "Your information was updated successfully",
    };
  },
};

export default auth;
