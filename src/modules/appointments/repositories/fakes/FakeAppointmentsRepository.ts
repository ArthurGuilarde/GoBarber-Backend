import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

class FakeAppointmentsRepository implements IAppointmentsRepository {
  private appointmentArray: Appointment[] = [];

  /**
   * create
   */
  public async create({
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), provider_id, date });

    this.appointmentArray.push(appointment);

    return appointment;
  }

  /**
   * findByDate
   */
  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointmentArray.find(appointment =>
      isEqual(appointment.date, date),
    );

    return findAppointment || undefined;
  }
}

export default FakeAppointmentsRepository;
