import { login, register } from "../controllers/authControllers.js";

const authRoutes = (app) => {
    // @Desc    Register new user
    // @Access  Public
    app.route("/api/auth/register").post(register);

    // @Desc    Login existing user
    // @Access  Public
    app.route("/api/auth/login").post(login);
};

export default authRoutes;
