import User from '@modules/users/infra/typeorm/entities/Users';
import AppError from '@shared/errors/AppError';
import CreateUsersService from './CreateUsersService';
import UpdateAvatarService from './UpdateAvatarService';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/hashProvider/fakes/FakeHashProvider';
import FakeStorageProvider from '@shared/container/providers/storageProvider/fakes/FakeStorageProvider';

describe('UpdateAvatar', () => {
  test('should be able to update an user avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

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

    const updateAvatarService = new UpdateAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const userAvatarUpdated = await updateAvatarService.execute({
      user_id: createdUser.id,
      avatarFilename: 'avatar.jpg',
    });

    await expect(userAvatarUpdated.avatar).toBe('avatar.jpg');

    const avatarUpdated = await updateAvatarService.execute({
      user_id: createdUser.id,
      avatarFilename: 'avatar2.jpg',
    });

    await expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    await expect(avatarUpdated.avatar).toBe('avatar2.jpg');
  });

  test('should not be able to update an avatar of one invalid user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateAvatarService = new UpdateAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    await expect(
      updateAvatarService.execute({
        user_id: 'non-existing-id',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
