import 'reflect-metadata';
import { decode } from 'jsonwebtoken';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import ResetPasswordService from './ResetPasswordService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/mailProvider/fakes/FakeMailProvider';
import FakeHashProvider from '@modules/users/providers/hashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

describe('ResetPassword', () => {
  test('should be able to redefine password.', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeMailProvider = new FakeMailProvider();
    const fakeHashProvider = new FakeHashProvider();

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

    const resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const userUpdated = await resetPasswordService.execute({
      token,
      newPassword: '123456',
    });

    expect(userUpdated.password).toBe('123456');
  });

  test('should not be able to use JWT expired to redefine password.', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTQ2NTU2MjksImV4cCI6MTU5NDY1NTYzMCwic3ViIjoiZWM3NGVlZjctZjFjZS00NTMwLThlOWYtMmRmOTdjYjEwMWVjIn0.KSLSJZmLmq9w0kMNiilNatoGkBAm9VycHI1xsPViYHk';

    const resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await expect(
      resetPasswordService.execute({
        token,
        newPassword: '123456',
      }),
    ).rejects;
  });

  test('should not be able to use invalid signature JWT token to redefine password.', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTQ2NTYwMzEsImV4cCI6MTU5NDY1NjAzMiwic3ViIjoiNTJlZGI5OTctMWE3MC00YjVlLWIxNDYtYjFhNjc4OTE3ZTY5In0.TrkDCZ2KEPZiPoE81I2qEBUkyA_HxCwSpC0-0S2YFpI';

    const resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await expect(
      resetPasswordService.execute({
        token,
        newPassword: '123456',
      }),
    ).rejects;
  });
});
