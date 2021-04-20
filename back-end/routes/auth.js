import { login, register } from "../controllers/authControllers";

const routes = (app) => {
    app.route("api/auth/register").post(register);

    app.route("api/auth/login").post(login);
};
export default routes;
