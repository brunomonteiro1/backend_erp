import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  id: string;
  name: string;
  email: string;
  level: number;
  status: boolean;
  password?: string;
}

@injectable()
class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  async execute({
    id,
    name,
    email,
    level,
    status,
    password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('User not found');
    }

    const emailExists = await this.usersRepository.findByEmail(email);

    if (emailExists && emailExists.id !== user.id) {
      throw new AppError('Already have a user with this email');
    }

    user.name = name;
    user.email = email;
    user.status = status;
    user.level = level;

    if (password) {
      if (password !== user.password) {
        user.password = await this.hashProvider.generateHash(password);
      }
    }

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserService;
