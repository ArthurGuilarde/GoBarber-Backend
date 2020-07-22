import { Router } from 'express';
import authTokenCheck from '@modules/users/infra/http/middlewares/authTokenCheck';
import appoitmentsRoute from '@modules/appointments/infra/http/routes/appointments.routes';
import providersRoute from '@modules/appointments/infra/http/routes/providers.routes';
import usersRoute from '@modules/users/infra/http/routes/users.routes';
import sessionsRoute from '@modules/users/infra/http/routes/sessions.routes';
import profilesRoute from '@modules/users/infra/http/routes/profile.routes';

const routes = Router();

routes.use('/sessions', sessionsRoute);
routes.use('/users', usersRoute);
routes.use('/appointments', authTokenCheck, appoitmentsRoute);
routes.use('/providers', providersRoute);
routes.use('/profiles', profilesRoute);

export default routes;
