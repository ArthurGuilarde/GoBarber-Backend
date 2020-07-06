import { startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  date: Date;
  provider_id: string;
}

@injectable()
export default class AppointmentsCreateService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  /**
   * execute
   */
  public async execute({ date, provider_id }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const findAppointmentSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentSameDate) {
      throw new AppError('This appointment is aredy booked!', 401);
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}
