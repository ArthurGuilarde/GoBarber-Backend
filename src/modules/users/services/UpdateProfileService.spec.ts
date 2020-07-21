import User from '@modules/users/infra/typeorm/entities/Users';
import AppError from '@shared/errors/AppError';
import UpdateProfileService from './UpdateProfileService';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/hashProvider/fakes/FakeHashProvider';

describe('UpdateProfile', () => {
  test('should be able to update an user profile', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const user = new User();
    const name = 'test';
    const email = 'test@gmail.com';
    const password = '123';

    Object.assign(user, { name, email, password });
    const createdUser = await fakeUsersRepository.create(user);
    await expect(createdUser).toHaveProperty('id');

    const updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const updatedUser = await updateProfileService.execute({
      user_id: createdUser.id,
      email: 'test2@gmail.com',
      name: 'test2',
    });
    expect(updatedUser.name).toBe('test2');
  });

  test('should not be able to update an user profile with an exists email.', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const name = 'test';
    const email = 'test@gmail.com';
    const password = '123';

    const createdUser = await fakeUsersRepository.create({
      name,
      email,
      password,
    });
    await expect(createdUser).toHaveProperty('id');

    const name2 = 'test2';
    const email2 = 'test2@gmail.com';
    const password2 = '123';

    const createdUser2 = await fakeUsersRepository.create({
      name: name2,
      email: email2,
      password: password2,
    });
    await expect(createdUser2).toHaveProperty('id');

    const updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await expect(
      updateProfileService.execute({
        user_id: createdUser.id,
        email: 'test2@gmail.com',
        name: 'test',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  test('should be able to update password.', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const name = 'test';
    const email = 'test@gmail.com';
    const password = '123';

    const createdUser = await fakeUsersRepository.create({
      name,
      email,
      password,
    });
    await expect(createdUser).toHaveProperty('id');

    const updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const updatedUser = await updateProfileService.execute({
      user_id: createdUser.id,
      email: 'test2@gmail.com',
      name: 'test',
      old_password: password,
      password: '456',
    });

    expect(updatedUser.password).toBe('456');
  });

  test('should not be able to update password with missing properties.', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const name = 'test';
    const email = 'test@gmail.com';
    const password = '123';

    const createdUser = await fakeUsersRepository.create({
      name,
      email,
      password,
    });
    await expect(createdUser).toHaveProperty('id');

    const updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const updatedUser = await expect(
      updateProfileService.execute({
        user_id: createdUser.id,
        email: 'test2@gmail.com',
        name: 'test',
        old_password: password,
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(
      updateProfileService.execute({
        user_id: createdUser.id,
        email: 'test2@gmail.com',
        name: 'test',
        password: '456',
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(
      updateProfileService.execute({
        user_id: createdUser.id,
        email: 'test2@gmail.com',
        name: 'test',
        old_password: 'invalidPassword',
        password: '456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
