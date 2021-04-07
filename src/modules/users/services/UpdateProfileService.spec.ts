import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

describe('UpdateProfileUser', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeHashProvider: FakeHashProvider;
  let updateProfile: UpdateProfileService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('should be able to update profile of the user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Bruno Monteiro',
      email: 'brunomonteiro3@outlook.com.br',
      password: '123456',
      level: 1,
      status: true,
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Bruno Monteiro1',
      email: 'brunomonteiro4@outlook.com.br',
    });

    expect(updatedUser.name).toBe('Bruno Monteiro1');
    expect(updatedUser.email).toBe('brunomonteiro4@outlook.com.br');
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
      updateProfile.execute({
        user_id: user.id,
        name: 'Bruno Monteiro',
        email: 'brunomonteiro3@outlook.com.br',
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

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Bruno Monteiro',
      email: 'brunomonteiro3@outlook.com.br',
      old_password: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without inform the old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Bruno Monteiro',
      email: 'brunomonteiro3@outlook.com.br',
      password: '123456',
      level: 1,
      status: true,
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Bruno Monteiro',
        email: 'brunomonteiro3@outlook.com.br',
        // old passwd is not informed
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Bruno Monteiro',
      email: 'brunomonteiro3@outlook.com.br',
      password: '123456',
      level: 1,
      status: true,
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Bruno Monteiro',
        email: 'brunomonteiro3@outlook.com.br',
        old_password: 'xx-wrong-password-xx',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update profile from non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non_existing_user_id_',
        name: 'Bruno Monteiro',
        email: 'brunomonteiro3@outlook.com.br',
        old_password: 'xx-wrong-password-xx',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
