import { Router } from 'express';
import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';
import authTokenCheck from '@modules/users/infra/http/middlewares/authTokenCheck';

const providersRoute = Router();
const providersController = new ProvidersController();

providersRoute.use(authTokenCheck);
providersRoute.get('/', providersController.index);

export default providersRoute;
