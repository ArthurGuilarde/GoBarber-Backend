import User from '@modules/users/infra/typeorm/entities/Users';
import AppError from '@shared/errors/AppError';
import CreateUsersService from './CreateUsersService';
import UpdateAvatarService from './UpdateAvatarService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/hashProvider/fakes/FakeHashProvider';

describe('UpdateAvatar', () => {
  test('should be able to update an user avatar', async () => {
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

    const updateAvatarService = new UpdateAvatarService(fakeUsersRepository);

    const userAvatarUpdated = await updateAvatarService.execute({
      user_id: createdUser.id,
      avatarFilename: 'teste.jpg',
    });

    await expect(userAvatarUpdated).toHaveProperty('avatar');
    await expect(
      updateAvatarService.execute({
        user_id: createdUser.id,
        avatarFilename: 'teste.jpg',
      }),
    ).toHaveProperty('avatar');
  });
});
