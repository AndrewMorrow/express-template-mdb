import {
  login,
  register,
  requestPasswordReset,
  resetPassword,
  updatePassword,
  updateUser,
} from "../services/auth.service.js";
// import validateRegisterInput from "../validation/register.js";
// import validateLoginInput from "../validation/login.js";
// import validatePassUpdateInput from "../validation/updatePassword.js";
// import validatePassResetInput from "../validation/resetPassword.js";
// import validateUserUpdateInput from "../validation/updateUser.js";
import validate from "../validation/validation.js";

// register new user controller
const registerController = async (req, res, next) => {
  // validate user input
  await validate.register(req.body);

  const registerService = await register(
    req.body.firstName,
    req.body.lastName,
    req.body.email,
    req.body.password
  );

  return res.json(registerService);
};

// login existing user controller
const loginController = async (req, res, next) => {
  // validate user input
  await validate.login(req.body);
  const loginService = await login(req.body.email, req.body.password);

  return res.json(loginService);
};

// returns current user with JWT
const getUserController = async (req, res, next) => {
  const { _id, firstName, lastName, email, date } = req.user;

  return res.json({ _id, firstName, lastName, email, date });
};

// request password reset controller
const requestPasswordResetController = async (req, res, next) => {
  await requestPasswordReset(req.body.email);

  return res.json({
    message: "Please check your email to reset your password",
  });
};

// reset password controller
const resetPasswordController = async (req, res, next) => {
  // validate user input
  await validate.resetPassword(req.body);
  const resetPasswordService = await resetPassword(
    req.body.userId,
    req.body.token,
    req.body.password
  );

  return res.json({
    message: "Your password has been successfully updated!",
  });
};

// update password controller
const updatePasswordController = async (req, res, next) => {
  // Validate user input
  await validate.updatePassword(req.body);
  const updatePasswordService = await updatePassword(
    req.body.userId,
    req.body.currPass,
    req.body.updatedPass
  );

  return res.json({ message: "Your password was updated successfully" });
};

// update user info controller
const updateUserController = async (req, res, next) => {
  // validate user input
  await validate.updateUser(req.body);
  console.log(req.user);
  const updateUserService = await updateUser(req.user._id, req.body);

  return res.json(updateUserService);
};

// export all controllers
export {
  registerController,
  loginController,
  requestPasswordResetController,
  resetPasswordController,
  updatePasswordController,
  updateUserController,
  getUserController,
};
