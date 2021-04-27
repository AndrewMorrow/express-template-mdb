import { login, register } from "../controllers/authControllers.js";
import { catchError } from "../middleware/customErrorHandler.js";

const authRoutes = (app) => {
    // @Desc    Register new user
    // @Access  Public
    app.route("/api/auth/register").post(register);

    // @Desc    Login existing user
    // @Access  Public
    app.route("/api/auth/login").post(catchError(login));

    // @Desc    Reset existing user password
    // @Access  Public
    app.route("/api/auth/service/reset").post(catchError(login));
};

export default authRoutes;
