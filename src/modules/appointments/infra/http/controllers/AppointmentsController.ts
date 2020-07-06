import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import AppointmentsCreateService from '@modules/appointments/services/CreateAppointmentsService';

export default class AppointmentsController {
  /**
   * create
   */
  public async create(request: Request, response: Response): Promise<Response> {
    const { provider_id, date } = request.body;

    const parsedDate = parseISO(date);

    const appointment = await container
      .resolve(AppointmentsCreateService)
      .execute({
        provider_id,
        date: parsedDate,
      });

    return response.json(appointment);
  }
}
