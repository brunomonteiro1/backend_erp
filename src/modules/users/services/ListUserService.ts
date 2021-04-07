import { injectable, inject } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';


@injectable()
class IndexUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute(): Promise<User[] | undefined> {
    const resultUsers = await this.usersRepository.findByActive();
    const users = resultUsers?.[0];

    return users;
  }
}

export default IndexUserService;
