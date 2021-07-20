import {
  login,
  register,
  requestPasswordReset,
  resetPassword,
  updatePassword,
  updateUser,
} from "../services/auth.service.js";
import validateRegisterInput from "../validation/register.js";
import validateLoginInput from "../validation/login.js";
import validatePassUpdateInput from "../validation/updatePassword.js";
import validateUserUpdateInput from "../validation/updateUser.js";

const registerController = async (req, res, next) => {
  await validateRegisterInput(req.body);

  const registerService = await register(
    req.body.firstName,
    req.body.lastName,
    req.body.email,
    req.body.password
  );

  return res.json(registerService);
};

const loginController = async (req, res, next) => {
  await validateLoginInput(req.body);
  const loginService = await login(req.body.email, req.body.password);

  return res.json(loginService);
};

const getUserController = async (req, res, next) => {
  const { _id, firstName, lastName, email, date } = req.user;

  return res.json({ _id, firstName, lastName, email, date });
};

const resetPasswordRequestController = async (req, res, next) => {
  await requestPasswordReset(req.body.email);

  return res.json({
    message: "Please check your email to reset your password",
  });
};

const resetPasswordController = async (req, res, next) => {
  const resetPasswordService = await resetPassword(
    req.body.userId,
    req.body.token,
    req.body.password
  );

  return res.json(resetPasswordService);
};

const updatePasswordController = async (req, res, next) => {
  await validatePassUpdateInput(req.body);
  const updatePasswordService = await updatePassword(
    req.body.userId,
    req.body.currPass,
    req.body.updatedPass
  );

  return res.json({ message: "Your password was updated successfully" });
};

const updateUserController = async (req, res, next) => {
  await validateUserUpdateInput(req.body);
  console.log(req.user);
  const updateUserService = await updateUser(req.user._id, req.body);

  return res.json(updateUserService);
};

export {
  registerController,
  loginController,
  resetPasswordRequestController,
  resetPasswordController,
  updatePasswordController,
  updateUserController,
  getUserController,
};
