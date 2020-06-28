import { getRepository } from 'typeorm'
import User from '../models/Users'
import { hash } from 'bcryptjs'

interface Request {
  name: string,
  email: string,
  password: string,
}
export default class UsersCreateService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const userRepository = getRepository(User)

    const checkUserExists = await userRepository.findOne({ where: { email } })

    if (checkUserExists) {
      throw new Error("Email address already used.");
    }

    const hasedPass = await hash(password, 8)
   
    const user = userRepository.create({
      name,
      email,
      password: hasedPass,
    })

    await userRepository.save(user)

    return user
  }
}