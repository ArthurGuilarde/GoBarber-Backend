import { getRepository } from "typeorm"
import fs from "fs"
import User from '../models/Users'
import path from 'path'

import uploadConfig from '../config/upload'

interface Request {
  user_id: string,
  avatarFilename: string
}

export default class UpdateAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const userRepo = getRepository(User)

    const user = await userRepo.findOne(user_id)

    if (!user) {
      throw new Error("ONly authenticated users can change avatar.")
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar)
      const isExists = await fs.promises.stat(userAvatarFilePath)

      if (isExists) {
        await fs.promises.unlink(userAvatarFilePath)
      }
      user.avatar = avatarFilename

      await userRepo.save(user)

      return user
    }

    user.avatar = avatarFilename
    await userRepo.save(user)
    return user
  }
}