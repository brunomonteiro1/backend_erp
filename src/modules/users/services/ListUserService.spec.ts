import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ListUserService from './ListUserService';

describe('ListUserAvatar', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let indexUser: ListUserService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    indexUser = new ListUserService(fakeUsersRepository);
  });

  it('should be able to list the active users', async () => {
    await fakeUsersRepository.create({
      name: 'Bruno Monteiro',
      email: 'brunomonteiro3@outlook.com.br',
      password: '123456',
      level: 1,
      status: true,
    });

    const users = await indexUser.execute();

    expect(users);
  });
});
