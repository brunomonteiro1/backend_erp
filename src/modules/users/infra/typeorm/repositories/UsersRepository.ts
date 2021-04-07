import { getRepository, Repository } from 'typeorm';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findAll(): Promise<[User[], number] | undefined> {
    const users = await this.ormRepository.findAndCount();
    return users;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }

  public async findByActive(): Promise<[User[], number] | undefined> {
    const users = await this.ormRepository.findAndCount({
      order: { created_at: 'DESC' },
      withDeleted: false,
    });

    return users;
  }

  public async findByCancel(): Promise<[User[], number] | undefined> {
    const users = await this.ormRepository.findAndCount({
      order: { created_at: 'DESC' },
      withDeleted: true,
    });

    return users;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { email } });

    return user;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(userData);

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async delete(id: string): Promise<void> {
    this.ormRepository.delete(id);
  }

  public async cancel(id: string): Promise<void> {
    this.ormRepository.softDelete(id);
  }
}

export default UsersRepository;
