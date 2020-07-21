import { container } from 'tsyringe';
import { Request, Response } from 'express';

import sessionsCreateService from '@modules/users/services/CreateSessionService';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

export default class SessionsController {
  /**
   * create
   */
  public async create(request: Request, response: Response): Promise<Response> {
    const usersRepository = new UsersRepository();
    const { email, password } = request.body;

    const { user, token } = await container
      .resolve(sessionsCreateService)
      .execute({
        email,
        password,
      });

    delete user.password;

    return response.json({ user, token });
  }
}
