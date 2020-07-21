import { container } from 'tsyringe';
import { Request, Response } from 'express';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  /**
   * show
   */
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const user = await container
      .resolve(ShowProfileService)
      .execute({ user_id });

    return response.json(user);
  }

  /**
   * update
   */
  public async update(request: Request, response: Response): Promise<Response> {
    const { name, email, old_password, password } = request.body;

    const user_id = request.user.id;

    const userUpdated = await container.resolve(UpdateProfileService).execute({
      user_id,
      name,
      email,
      old_password,
      password,
    });

    delete userUpdated.password;

    return response.json(userUpdated);
  }
}
