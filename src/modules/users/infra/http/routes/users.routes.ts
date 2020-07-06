import multer from 'multer';
import { Router } from 'express';

import authTokenCheck from '../middlewares/authTokenCheck';
import uploadConfig from '@config/upload';

import UsersController from '@modules/users/infra/http/controllers/UsersController';
import UsersAvatarController from '@modules/users/infra/http/controllers/UsersAvatarController';

const usersRoute = Router();
const usersController = new UsersController();
const usersAvatarController = new UsersAvatarController();

const upload = multer(uploadConfig);

usersRoute.post('/', usersController.create);

usersRoute.patch(
  '/avatar',
  authTokenCheck,
  upload.single('Avatar'),
  usersAvatarController.update,
);

export default usersRoute;
