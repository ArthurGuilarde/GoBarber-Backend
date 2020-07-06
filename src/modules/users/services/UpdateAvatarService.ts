import fs from 'fs';
import User from '@modules/users/infra/typeorm/entities/Users';
import path from 'path';
import { inject, injectable } from 'tsyringe';

import uploadConfig from '@config/upload';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}
@injectable()
export default class UpdateAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}
  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new Error('Only authenticated users can change avatar.');
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const isExists = await fs.promises.stat(userAvatarFilePath);

      if (isExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
      user.avatar = avatarFilename;

      await this.usersRepository.save(user);

      return user;
    }

    user.avatar = avatarFilename;
    await this.usersRepository.save(user);
    return user;
  }
}
