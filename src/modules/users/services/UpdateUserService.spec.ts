import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserService from './UpdateUserService';

describe('UpdateUser', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeHashProvider: FakeHashProvider;
  let updateUser: UpdateUserService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateUser = new UpdateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('should be able to update user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Bruno Monteiro',
      email: 'brunomonteiro3@outlook.com.br',
      password: '123456',
      level: 1,
      status: true,
    });

    const updatedUser = await updateUser.execute({
      id: user.id,
      name: 'Bruno Monteiro1',
      email: 'brunomonteiro4@outlook.com.br',
      level: 2,
      status: false,
    });

    expect(updatedUser.name).toBe('Bruno Monteiro1');
    expect(updatedUser.email).toBe('brunomonteiro4@outlook.com.br');
    expect(updatedUser.level).toBe(2);
    expect(updatedUser.status).toBe(false);
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Bruno Monteiro',
      email: 'brunomonteiro3@outlook.com.br',
      password: '123456',
      level: 1,
      status: true,
    });

    const user = await fakeUsersRepository.create({
      name: 'Test',
      email: 'test@sample.com',
      password: '123456',
      level: 1,
      status: true,
    });

    await expect(
      updateUser.execute({
        id: user.id,
        name: 'Bruno Monteiro',
        email: 'brunomonteiro3@outlook.com.br',
        level: 1,
        status: true,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Bruno Monteiro',
      email: 'brunomonteiro3@outlook.com.br',
      password: '123456',
      level: 1,
      status: true,
    });

    const updatedUser = await updateUser.execute({
      id: user.id,
      name: 'Bruno Monteiro',
      email: 'brunomonteiro3@outlook.com.br',
      password: '123123',
      level: 1,
      status: true,
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update user from non-existing user', async () => {
    await expect(
      updateUser.execute({
        id: 'non_existing_user_id_',
        name: 'Bruno Monteiro',
        email: 'brunomonteiro3@outlook.com.br',
        password: '123123',
        level: 1,
        status: true,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
