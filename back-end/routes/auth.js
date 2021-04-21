import express from "express";
import { login, register, test } from "../controllers/authControllers.js";

// const app = express();

const authRoutes = (app) => {
    app.route("/api/auth/test").get(test);
    // app.route("/api/auth/contacts").get((req, res, next) => {
    //     // middleware
    //     console.log(`Request from: ${req.originalUrl}`);
    //     console.log(`Request type: ${req.method}`);
    //     next();
    // }, test);
    app.route("api/auth/register").post(register);
    app.route("api/auth/login").post(login);
};

export default authRoutes;
