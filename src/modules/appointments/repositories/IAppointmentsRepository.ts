import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAppointmentsInDayDTO from '@modules/appointments/dtos/IFindAppointmentsInDayDTO';
import IFindAppointmentsInMonthDTO from '@modules/appointments/dtos/IFindAppointmentsInMonthDTO ';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findDayAppointments(data: IFindAppointmentsInDayDTO): Promise<Appointment[]>;
  findMonthAppointments(
    data: IFindAppointmentsInMonthDTO,
  ): Promise<Appointment[]>;
}
