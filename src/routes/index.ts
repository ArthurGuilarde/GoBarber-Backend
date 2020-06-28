import { Router } from 'express'
import authTokenCheck from '../middlewares/authTokenCheck'
import appoitmentsRoute from './appointments.routes'
import usersRoute from './users.routes'
import sessionsRoute from './sessions.routes'


const routes = Router()

routes.use('/sessions', sessionsRoute)
routes.use('/users', usersRoute)

routes.use('/appointments', authTokenCheck, appoitmentsRoute)

export default routes
