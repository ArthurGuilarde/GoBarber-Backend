import { uuid } from 'uuidv4';
import User from '@modules/users/infra/typeorm/entities/Users';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

class FakeUsersRepository implements IUsersRepository {
  private userArray: User[] = [];
  /**
   * findByEmail
   */
  public async findByEmail(email: string): Promise<User | undefined> {
    const userFindByEmail = this.userArray.find(user => user.email === email);
    return userFindByEmail || undefined;
  }

  /**
   * findById
   */
  public async findById(id: string): Promise<User | undefined> {
    const userFind = this.userArray.find(user => user.id === id);
    return userFind || undefined;
  }

  /**
   * create
   */
  public async create({
    email,
    name,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid(), email, name, password });

    this.userArray.push(user);

    return user;
  }

  /**
   * save
   */
  public async save(data: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, data);

    this.userArray.push(user);

    return user;
  }
}

export default FakeUsersRepository;
