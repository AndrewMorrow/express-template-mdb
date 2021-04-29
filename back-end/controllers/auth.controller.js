import {
    login,
    register,
    requestPasswordReset,
    resetPassword,
} from "../services/auth.service.js";
import validateRegisterInput from "../validation/register.js";
import validateLoginInput from "../validation/login.js";

const registerController = async (req, res, next) => {
    await validateRegisterInput(req.body);

    const registerService = await register(
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.password
    );
    // console.log(registerService);
    return res.json(registerService);
};

const loginController = async (req, res, next) => {
    await validateLoginInput(req.body);
    // if (!isValid) {
    //     return res.status(400).json(errors);
    // }
    const loginService = await login(req.body.email, req.body.password);

    return res.json(loginService);
};

const resetPasswordRequestController = async (req, res, next) => {
    const requestPasswordResetService = await requestPasswordReset(
        req.body.email
    );

    return res.json(requestPasswordResetService);
};

const resetPasswordController = async (req, res, next) => {
    const resetPasswordService = await resetPassword(
        req.body.userId,
        req.body.token,
        req.body.password
    );

    return res.json(resetPasswordService);
};

export {
    registerController,
    loginController,
    resetPasswordRequestController,
    resetPasswordController,
};
