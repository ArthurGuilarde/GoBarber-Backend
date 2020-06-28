import { Router } from 'express'
import sessionsCreateService from '../services/SessionsCreateService'

const sessionsRoute = Router()


sessionsRoute.post('/', async (req, resp) => {

  try {

    const { email, password } = req.body
    const {user, token} = await new sessionsCreateService().execute({
      email,
      password
    })
    
    delete user.password

    return resp.json({user, token})
  } catch (error) {
    return resp.status(400).json(error.message)
  }
})


export default sessionsRoute