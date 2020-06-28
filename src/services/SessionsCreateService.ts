import { getRepository } from 'typeorm'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import configAuth from "../config/configAuthorization";

import User from '../models/Users'

interface Request {
  email: string,
  password: string,
}

interface Response {
  user: User
  token: string
}

export default class SessionsCreateService {
  public async execute({ email, password }: Request): Promise<Response> {
    const userRepository = getRepository(User)

    const user = await userRepository.findOne({ where: {email} })

    if (!user) {
      throw new Error("Password/Email invalid.");
    }

    const isValidPassword = await compare(password, user.password)

    if (!isValidPassword) {
      throw new Error("Password/Email invalid.");
    }

    const {expiresIn, secret} = configAuth.jwt
    
    const token = sign({}, secret,
    {
      subject: user.id,
      expiresIn,
    })

    return { user, token }
  }
}