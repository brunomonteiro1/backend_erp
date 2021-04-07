import { v4 as uuid } from 'uuid';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '../../dtos/ICreateUserDTO';

import User from '../../infra/typeorm/entities/User';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findAll(): Promise<[User[], number] | undefined> {
    return [this.users.map(user => user), this.users.length];
  }

  public async findByActive(): Promise<[User[], number] | undefined> {
    return [
      this.users.filter(user => user.canceled_at === null),
      this.users.length,
    ];
  }

  public async findByCancel(): Promise<[User[], number] | undefined> {
    return [this.users.filter(user => user.canceled_at), this.users.length];
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid() }, userData);

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);
    this.users[findIndex] = user;
    return user;
  }

  public async delete(id: string): Promise<void> {
    const userId = this.users.findIndex(findUser => findUser.id === id);
    this.users.splice(userId, 1);
  }

  public async cancel(id: string): Promise<void> {
    const userId = this.users.findIndex(findUser => findUser.id === id);
    this.users.splice(userId, 1);
  }
}

export default FakeUsersRepository;
