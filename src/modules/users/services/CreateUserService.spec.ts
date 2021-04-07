import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeHashProvider: FakeHashProvider;
  let createUserService: CreateUserService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUserService.execute({
      name: 'Bruno Monteiro',
      email: 'brunomonteiro4@outlook.com.br',
      password: '123456',
      level: 1,
      status: true,
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('brunomonteiro4@outlook.com.br');
  });

  it('should not be able to create new user with the same email from another', async () => {
    const inputUser = {
      name: 'Bruno Monteiro',
      email: 'brunomonteiro3@outlook.com.br',
      password: '123456',
      level: 1,
      status: true,
    };

    await createUserService.execute(inputUser);

    await expect(createUserService.execute(inputUser)).rejects.toBeInstanceOf(
      AppError
    );
  });
});
