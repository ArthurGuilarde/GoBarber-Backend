import { inject, injectable } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
export default class ListAvailabilityDayService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findDayAppointments({
      day,
      month,
      provider_id,
      year,
    });
    const hourStart = 8;
    const numberOfHoursInDay = 10;

    const eachHourArray = Array.from(
      {
        length: numberOfHoursInDay,
      },
      (value, index) => index + hourStart,
    );

    const availability = eachHourArray.map(hour => {
      const appointmentsInHour = appointments.find(appointment => {
        return getHours(appointment.date) === hour;
      });

      const currentDate = new Date(Date.now());
      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !appointmentsInHour && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}
