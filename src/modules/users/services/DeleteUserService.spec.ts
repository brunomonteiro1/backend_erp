import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import DeleteUserService from './DeleteUserService';

describe('DeleteUserAvatar', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let deleteUser: DeleteUserService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    deleteUser = new DeleteUserService(
      fakeUsersRepository
    );
  });

  it('should be able to delete user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Bruno Monteiro',
      email: 'brunomonteiro3@outlook.com.br',
      password: '123456',
      level: 1,
      status: true,
    });

    await deleteUser.execute({
      id: user.id,
    });

    expect(user.id).toBe(user.id);
  });

  it('should not be able to update user from non-existing user', async () => {
    await expect(
      deleteUser.execute({
        id: 'non_existing_user_id_',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
