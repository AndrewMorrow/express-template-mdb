import express from "express";
import { login, register } from "../controllers/authControllers.js";

// const app = express();

const authRoutes = (app) => {
    app.route("/api/auth/register").post(register);
    app.route("/api/auth/login").post(login);
};

export default authRoutes;
