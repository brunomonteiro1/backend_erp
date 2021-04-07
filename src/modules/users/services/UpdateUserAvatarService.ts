import { injectable, inject } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import module from '@config/modules';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  id: string;
  filename: string;
}

@injectable()
class UpdateAvatarUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  async execute({ id, filename }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('User not found');
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const nameFile = await this.storageProvider.saveFile(filename);

    user.avatar = nameFile;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateAvatarUserService;
