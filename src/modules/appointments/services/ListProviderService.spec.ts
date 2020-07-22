import 'reflect-metadata';
import ListProviderService from './ListProviderService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let listProviderService: ListProviderService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProviderService = new ListProviderService(fakeUsersRepository);
  });

  test('should be able to show all providers.', async () => {
    const user = await fakeUsersRepository.create({
      email: 'first@gmail.com',
      name: 'Sr First',
      password: '123',
    });

    const user2 = await fakeUsersRepository.create({
      email: 'second@gmail.com',
      name: 'Sr Second',
      password: '123',
    });

    const user3 = await fakeUsersRepository.create({
      email: 'third@gmail.com',
      name: 'Sr Third',
      password: '123',
    });

    const providers = await listProviderService.execute({ user_id: user.id });

    expect(providers).toEqual([user2, user3]);
  });
});
