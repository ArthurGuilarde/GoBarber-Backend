import { Request, Response } from 'express';
import UpdateAvatarService from '@modules/users/services/UpdateAvatarService';
import { container } from 'tsyringe';

export default class UsersAvatarController {
  /**
   * update
   */
  public async update(request: Request, response: Response): Promise<Response> {
    const updateAvatar = container.resolve(UpdateAvatarService);

    const user = await updateAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  }
}
