import {
    registerController,
    loginController,
    resetPasswordRequestController,
    resetPasswordController,
    updatePasswordController,
} from "../controllers/auth.controller.js";
import { catchError } from "../middleware/customErrorHandler.js";

const authRoutes = (app) => {
    // @Desc    Register new user
    // @Access  Public
    app.route("/api/auth/register").post(catchError(registerController));

    // @Desc    Login existing user
    // @Access  Public
    app.route("/api/auth/login").post(catchError(loginController));

    // @Desc    Reset existing user password
    // @Access  Public
    app.route("/api/auth/service/reset").post(
        catchError(resetPasswordController)
    );

    // @Desc    Request user password reset
    // @Access  Public
    app.route("/api/auth/service/requestReset").post(
        catchError(resetPasswordRequestController)
    );

    // @Desc    User password Update
    // @Access  Private
    app.route("/api/auth/service/passwordUpdate").put(
        catchError(updatePasswordController)
    );
};

export default authRoutes;
