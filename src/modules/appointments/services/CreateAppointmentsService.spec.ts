import 'reflect-metadata';
import CreateAppointmentService from './CreateAppointmentsService';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError';

describe('CreateAppointment', () => {
  test('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();

    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: '123',
    });

    await expect(appointment).toHaveProperty('id');
    await expect(appointment.provider_id).toBe('123');
  });

  test('should not be able to create two appointments on the same time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();

    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
    const appointmentDate = new Date();

    const appointment = await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: '123',
    });

    await expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
