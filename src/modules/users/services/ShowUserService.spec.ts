import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowUserService from './ShowUserService';

describe('ShowUserAvatar', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let showUser: ShowUserService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showUser = new ShowUserService(fakeUsersRepository);
  });

  it('should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Bruno Monteiro',
      email: 'brunomonteiro3@outlook.com.br',
      password: '123456',
      level: 1,
      status: true,
    });

    const profile = await showUser.execute({
      id: user.id,
    });

    expect(profile.name).toBe('Bruno Monteiro');
    expect(profile.email).toBe('brunomonteiro3@outlook.com.br');
  });

  it('should not be able to show the profile from non-existing user', async () => {
    await expect(
      showUser.execute({
        id: 'non-existing-user_id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
