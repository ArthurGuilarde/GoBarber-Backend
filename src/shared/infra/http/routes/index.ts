import { Router } from "express";
import authTokenCheck from "@modules/users/infra/http/middlewares/authTokenCheck";
import appoitmentsRoute from "@modules/appointments/infra/http/routes/appointments.routes";
import usersRoute from "@modules/users/infra/http/routes/users.routes";
import sessionsRoute from "@modules/users/infra/http/routes/sessions.routes";

const routes = Router();

routes.use("/sessions", sessionsRoute);
routes.use("/users", usersRoute);

routes.use("/appointments", authTokenCheck, appoitmentsRoute);

export default routes;
