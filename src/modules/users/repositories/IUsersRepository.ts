import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';

export default interface IUsersRepository {
  findAll(): Promise<[User[], number] | undefined>;
  findByActive(): Promise<[User[], number] | undefined>;
  findByCancel(): Promise<[User[], number] | undefined>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  cancel(id: string): Promise<void>;
}
