import auth from "../services/auth.service.js";
// import validationRegisterInput from "../validation/register.js";
// import validateLoginInput from "../validation/login.js";
// import validatePassUpdateInput from "../validation/updatePassword.js";
// import validatePassResetInput from "../validation/resetPassword.js";
// import validateUserUpdateInput from "../validation/updateUser.js";
import validation from "../validation/validation.js";

const controllers = {
  // register new user controller
  registerController: async (req, res, next) => {
    // validate user input
    await validation.register(req.body);

    const registerService = await auth.register(
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.password,
      req.body.isAdmin,
    );

    return res.json(registerService);
  },
  // login existing user controller
  loginController: async (req, res, next) => {
    // validation user input
    await validation.login(req.body);
    const loginService = await auth.login(req.body.email, req.body.password);

    return res.json(loginService);
  },

  // returns current user with JWT
  getUserController: async (req, res, next) => {
    const { _id, firstName, lastName, email, date } = req.user;

    return res.json({ _id, firstName, lastName, email, date });
  },
  // request password reset controller
  requestPasswordResetController: async (req, res, next) => {
    await auth.requestPasswordReset(req.body.email);

    return res.json({
      message: "Please check your email to reset your password",
    });
  },
  // reset password controller
  resetPasswordController: async (req, res, next) => {
    // validation user input
    await validation.resetPassword(req.body);
    const resetPasswordService = await auth.resetPassword(
      req.body.userId,
      req.body.token,
      req.body.password
    );

    return res.json({
      message: "Your password has been successfully updated!",
    });
  },
  // update password controller
  updatePasswordController: async (req, res, next) => {
    // validation user input
    await validation.updatePassword(req.body);
    const updatePasswordService = await auth.updatePassword(
      req.body.userId,
      req.body.currPass,
      req.body.updatedPass
    );

    return res.json({ message: "Your password was updated successfully" });
  },
  // update user info controller
  updateUserController: async (req, res, next) => {
    // validation user input
    await validation.updateUser(req.body);
    console.log(req.user);
    const updateUserService = await auth.updateUser(req.user._id, req.body);

    return res.json(updateUserService);
  },
};

// export all controllers
export default controllers;
