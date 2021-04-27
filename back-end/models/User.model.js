import mongoose from "mongoose";
const Schema = mongoose.Schema;
const bcryptSalt = process.env.BCRYPT_SALT;
import bcrypt from "bcryptjs";

const UserSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: true,
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const hash = await bcrypt.hash(this.password, Number(bcryptSalt));
    this.password = hash;
    next();
});

const User = mongoose.model("User", UserSchema);

export default User;
