import User from '@modules/users/infra/typeorm/entities/Users';
import AppError from '@shared/errors/AppError';
import ShowProfileService from './ShowProfileService';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

describe('UpdateProfile', () => {
  test('should be able to show profile.', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const user = new User();
    const name = 'test';
    const email = 'test@gmail.com';
    const password = '123';

    Object.assign(user, { name, email, password });
    const createdUser = await fakeUsersRepository.create(user);
    await expect(createdUser).toHaveProperty('id');

    const showProfileService = await new ShowProfileService(
      fakeUsersRepository,
    ).execute({ user_id: createdUser.id });

    expect(showProfileService.name).toBe('test');
  });
});
