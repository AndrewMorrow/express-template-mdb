import PassportJwt from "passport-jwt";
const JwtStrategy = PassportJwt.Strategy;
const ExtractJwt = PassportJwt.ExtractJwt;
import mongoose from "mongoose";
const User = mongoose.model("User");
import dotenv from "dotenv";
dotenv.config();

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

export default (passport) => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            User.findById(jwt_payload.id)
                .then((user) => {
                    if (user) {
                        return done(null, user);
                    }

                    return done(user, false);
                })
                .catch((err) => {});
        })
    );
};
