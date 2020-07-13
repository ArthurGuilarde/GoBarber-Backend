import 'reflect-metadata';
import User from '@modules/users/infra/typeorm/entities/Users';
import AppError from '@shared/errors/AppError';
import CreateUsersService from './CreateUsersService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/hashProvider/fakes/FakeHashProvider';

describe('CreateUser', () => {
  test('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUsersService = new CreateUsersService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = new User();

    const name = 'test';
    const email = 'test@gmail.com';
    const password = '123';

    Object.assign(user, { name, email, password });

    const createdUser = await createUsersService.execute(user);

    await expect(createdUser).toHaveProperty('id');
  });

  test('should be not able to create a new user with same email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUsersService = new CreateUsersService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = new User();

    const name = 'test';
    const email = 'test@gmail.com';
    const password = '123';

    Object.assign(user, { name, email, password });

    await createUsersService.execute(user);

    await expect(createUsersService.execute(user)).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
