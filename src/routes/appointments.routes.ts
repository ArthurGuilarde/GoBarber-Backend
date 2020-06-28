import { Router } from 'express'
import { parseISO } from 'date-fns'
import {getCustomRepository} from 'typeorm'

import AppointmentsRepository from '../repositories/AppointmentsRepository'
import AppointmentsCreateService from '../services/AppointmentsCreateService'

const appoitmentsRoute = Router()

appoitmentsRoute.get('/', async (req, resp) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository)
  resp.json(await appointmentsRepository.find())
})

appoitmentsRoute.post('/', async (req, resp) => {
  const { provider_id, date } = req.body

  try {
    const parsedDate = parseISO(date)

    const appointment = await new AppointmentsCreateService()
      .execute({
        provider_id,
        date: parsedDate
      })

    return resp.json(appointment)
  } catch (error) {
    return resp.status(400).json(error.message)
  }
})


export default appoitmentsRoute