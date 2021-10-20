import controllers from "../controllers/auth.controller.js";
import { catchError } from "../middleware/customErrorHandler.js";
import passport from "passport";
import jwt from "jsonwebtoken";
// Middleware to use when routes require authenticated user.
const requiresAuth = passport.authenticate("jwt", { session: false });

// authorization routes
const authRoutes = (app) => {
  // @Desc    Register new user
  // @Access  Public
  app
    .route("/api/auth/register")
    .post(catchError(controllers.registerController));

  // @Desc    Login existing user
  // @Access  Public
  app.route("/api/auth/login").post(catchError(controllers.loginController));

  // @Desc    Get current user
  // @Access  Private
  app
    .route("/api/auth/getUser")
    .get(requiresAuth, catchError(controllers.getUserController));

  // @Desc    Reset existing user password
  // @Access  Public
  app
    .route("/api/auth/resetPassword")
    .post(catchError(controllers.resetPasswordController));

  // @Desc    Request user password reset
  // @Access  Public
  app
    .route("/api/auth/requestPasswordReset")
    .post(catchError(controllers.requestPasswordResetController));

  // @Desc    User password Update
  // @Access  Private
  app
    .route("/api/auth/updatePassword")
    .put(requiresAuth, catchError(controllers.updatePasswordController));

  // @Desc    User Information Update
  // @Access  Private
  app
    .route("/api/auth/updateUser")
    .put(requiresAuth, catchError(controllers.updateUserController));
};

export default authRoutes;
