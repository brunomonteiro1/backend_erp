import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeStorageProvider: FakeStorageProvider;
  let updateUserAvatarService: UpdateUserAvatarService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );
  });
  it('should be able to update avatar from user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Bruno Monteiro',
      email: 'brunomonteiro3@outlook.com.br',
      password: '123456',
      level: 1,
      status: true,
    });

    await updateUserAvatarService.execute({
      id: user.id,
      filename: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar from not existing user', async () => {
    await expect(
      updateUserAvatarService.execute({
        id: 'user-not-found',
        filename: 'avatar.jpg',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'Bruno Monteiro',
      email: 'brunomonteiro3@outlook.com.br',
      password: '123456',
      level: 1,
      status: true,
    });

    await updateUserAvatarService.execute({
      id: user.id,
      filename: 'avatar.jpg',
    });

    await updateUserAvatarService.execute({
      id: user.id,
      filename: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');

    expect(user.avatar).toBe('avatar2.jpg');
  });
});
