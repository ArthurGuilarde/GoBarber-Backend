import multer from 'multer';
import { container } from 'tsyringe';
import { Router, Request } from 'express';

import authTokenCheck from '../middlewares/authTokenCheck';
import uploadConfig from '@config/upload';

import UsersController from '@modules/users/infra/http/controllers/UsersController';
import UsersAvatarController from '@modules/users/infra/http/controllers/UsersAvatarController';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';

const usersRoute = Router();
const usersController = new UsersController();
const usersAvatarController = new UsersAvatarController();

const upload = multer(uploadConfig);

usersRoute.post('/', usersController.create);
usersRoute.post('/password', async (req, resp) => {
  const { email } = req.body as string;

  await container.resolve(SendForgotPasswordEmailService).execute({ email });

  return resp.json({ ok: true });
});

usersRoute.patch(
  '/avatar',
  authTokenCheck,
  upload.single('Avatar'),
  usersAvatarController.update,
);

export default usersRoute;
