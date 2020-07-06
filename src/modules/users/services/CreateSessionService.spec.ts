import 'reflect-metadata';
import AppError from '@shared/errors/AppError';

import CreateSessionService from './CreateSessionService';
import CreateUsersService from './CreateUsersService';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/hashProvider/fakes/FakeHashProvider';

describe('CreateSession', () => {
  test('should be able to create a new session', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUsersService = new CreateUsersService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const name = 'test';
    const email = 'test@gmail.com';
    const password = '123';

    const createdUser = await createUsersService.execute({
      name,
      email,
      password,
    });

    await expect(createdUser).toHaveProperty('id');

    const createSessionService = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const sessionCreated = await createSessionService.execute({
      email,
      password,
    });

    await expect(sessionCreated).toHaveProperty('token');
    await expect(sessionCreated.user).toEqual(createdUser);
  });

  test('should not be able to create session with incorrect email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUsersService = new CreateUsersService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const name = 'test';
    const email = 'test@gmail.com';
    const password = '123';

    const createdUser = await createUsersService.execute({
      name,
      email,
      password,
    });

    await expect(createdUser).toHaveProperty('id');

    const createSessionService = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const sessionCreated = await createSessionService.execute({
      email,
      password,
    });

    await expect(sessionCreated).toHaveProperty('token');
    await expect(sessionCreated.user).toEqual(createdUser);

    await expect(
      createSessionService.execute({
        email: 'newemail@gmail.com',
        password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  test('should not be able to create session with incorrect password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUsersService = new CreateUsersService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const name = 'test';
    const email = 'test@gmail.com';
    const password = '123';

    const createdUser = await createUsersService.execute({
      name,
      email,
      password,
    });

    await expect(createdUser).toHaveProperty('id');

    const createSessionService = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const sessionCreated = await createSessionService.execute({
      email,
      password,
    });

    await expect(sessionCreated).toHaveProperty('token');
    await expect(sessionCreated.user).toEqual(createdUser);

    await expect(
      createSessionService.execute({
        email,
        password: '456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
