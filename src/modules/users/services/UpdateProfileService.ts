import User from '@modules/users/infra/typeorm/entities/Users';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/hashProvider/models/IHashProvider';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    email,
    name,
    old_password,
    password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('E-mail already in use.');
    }

    Object.assign(user, { name, email });

    if ((old_password && !password) || (!old_password && password)) {
      throw new AppError('We need old and new password.');
    }

    if (old_password && password) {
      if (await this.hashProvider.compareHash(old_password, user.password)) {
        Object.assign(user, {
          password: await this.hashProvider.generateHash(password),
        });
      } else {
        throw new AppError('Invalid password.');
      }
    }

    return await this.usersRepository.save(user);
  }
}
