import { Router } from 'express';

import authTokenCheck from '../middlewares/authTokenCheck';

import ProfileController from '@modules/users/infra/http/controllers/ProfileController';

const profileRoutes = Router();
const profileController = new ProfileController();

profileRoutes.use(authTokenCheck);

profileRoutes.get('/', profileController.show);
profileRoutes.put('/', profileController.update);

export default profileRoutes;
