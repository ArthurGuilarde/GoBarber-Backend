import { Request, Response } from 'express';
import CreateUserService from '@modules/users/services/CreateUsersService';
import { container } from 'tsyringe';

export default class UsersController {
  /**
   * create
   */
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;
    const user = await container.resolve(CreateUserService).execute({
      name,
      email,
      password,
    });
    delete user.password;
    return response.json(user);
  }
}
