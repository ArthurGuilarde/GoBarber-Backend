import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import configAuth from '@config/configAuthorization';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/Users';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/mailProvider/models/IMailProvider';

interface IRequest {
  email: string;
}

interface IResponse {
  token: string;
}

@injectable()
export default class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute({ email }: IRequest): Promise<IResponse> {
    const userFound = await this.usersRepository.findByEmail(email);

    if (!userFound) {
      throw new AppError('User not found.');
    }

    const { expiresIn, secret } = configAuth.jwt;

    const token = sign({}, secret, {
      subject: userFound.id,
      expiresIn: '20m',
    });

    await this.mailProvider.sendMail(
      email,
      `Pedido de recuperacao de senha. ${token}`,
    );

    return { token };
  }
}
