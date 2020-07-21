import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import path from 'path';

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

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        email,
        name: userFound.name,
      },
      subject: '[Gobarber] Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: userFound.name,
          link: `http://localhost:3000/reset?token=${token}`,
        },
      },
    });

    return { token };
  }
}
