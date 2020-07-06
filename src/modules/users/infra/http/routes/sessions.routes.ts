import { Router } from 'express';

import SessionsController from '@modules/users/infra/http/controllers/SessionsController';

const sessionsRoute = Router();
const sessionsController = new SessionsController();

sessionsRoute.post('/', sessionsController.create);

export default sessionsRoute;
