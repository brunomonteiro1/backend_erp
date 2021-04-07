import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from '@modules/users/services/CreateUserService';
import CreateSessionService from './CreateSessionsService';

describe('CreateSession', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeHashProvider: FakeHashProvider;
  let createSessionService: CreateSessionService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createSessionService = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });
  it('should be able to authenticate', async () => {
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const user = await createUser.execute({
      name: 'Bruno Monteiro',
      email: 'brunomonteiro3@outlook.com.br',
      password: '123456',
      level: 1,
      status: true,
    });

    const response = await createSessionService.execute({
      email: 'brunomonteiro3@outlook.com.br',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with existing user', async () => {
    await expect(
      createSessionService.execute({
        email: 'brunomonteiro3@outlook.com.br',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    await createUser.execute({
      name: 'Bruno Monteiro',
      email: 'brunomonteiro3@outlook.com.br',
      password: '123456',
      level: 1,
      status: true,
    });

    await expect(
      createSessionService.execute({
        email: 'brunomonteiro3@outlook.com.br',
        password: 'password-incorrect',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with false status', async () => {
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    await createUser.execute({
      name: 'Bruno Monteiro',
      email: 'brunomonteiro3@outlook.com.br',
      password: '123456',
      level: 1,
      status: false,
    });

    await expect(
      createSessionService.execute({
        email: 'brunomonteiro3@outlook.com.br',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
