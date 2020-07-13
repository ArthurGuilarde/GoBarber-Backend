import 'reflect-metadata';
import { decode } from 'jsonwebtoken';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/mailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';

describe('SendForgotPassword', () => {
  test('should be able to recover the password using the email.', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeMailProvider = new FakeMailProvider();

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
    );

    await fakeUsersRepository.create({
      email: 'test@gmail.com',
      name: 'Test',
      password: '123',
    });

    await sendForgotPasswordEmailService.execute({ email: 'test@gmail.com' });

    expect(sendMail).toHaveBeenCalled();
  });

  test('should not be able to recover a non-existing user password.', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeMailProvider = new FakeMailProvider();

    const sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
    );

    await expect(
      sendForgotPasswordEmailService.execute({ email: 'test@gmail.com' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  test('should be able to recover token for password reset.', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeMailProvider = new FakeMailProvider();

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
    );

    const userCreated = await fakeUsersRepository.create({
      email: 'test@gmail.com',
      name: 'Test',
      password: '123',
    });

    const { token } = await sendForgotPasswordEmailService.execute({
      email: 'test@gmail.com',
    });

    const tokenDecoded = decode(token);

    expect(sendMail).toHaveBeenCalled();

    expect(tokenDecoded).toHaveProperty('sub', userCreated.id);
  });
});
