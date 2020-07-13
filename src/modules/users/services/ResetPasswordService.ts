import { sign, decode, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import configAuth from '@config/configAuthorization';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/Users';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/hashProvider/models/IHashProvider';

interface IRequest {
  token: string;
  newPassword: string;
}

interface ITokenDecoded {
  sub: string;
}

@injectable()
export default class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, newPassword }: IRequest): Promise<User> {
    verify(token, configAuth.jwt.secret);

    const tokenDecoded = decode(token) as ITokenDecoded;

    const userFound = await this.usersRepository.findById(tokenDecoded.sub);

    if (!userFound) {
      throw new AppError('User not found.');
    }

    Object.assign(userFound, {
      password: await this.hashProvider.generateHash(newPassword),
    });

    this.usersRepository.save(userFound);

    return userFound;
  }
}
