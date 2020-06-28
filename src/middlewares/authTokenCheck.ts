import { Request, Response, NextFunction } from 'express'
import { verify } from "jsonwebtoken";
import configAuth from "../config/configAuthorization";

interface tokenPayload {
  iat: string
  exp: string
  sub: string
}


export default function authTokenCheck(req: Request, res: Response, next: NextFunction): void {

  const authHeader = req.headers.authorization

  if (!authHeader) {
    throw new Error('Missing Token!')
  }

  const [, token] = authHeader.split(' ')

  const isValidToken = verify(token, configAuth.jwt.secret)

  if (!isValidToken) {
    throw new Error('Invalid Token!')
  }

  const { sub } = isValidToken as tokenPayload

  req.user = {
    id:sub
  }

  return next()

}