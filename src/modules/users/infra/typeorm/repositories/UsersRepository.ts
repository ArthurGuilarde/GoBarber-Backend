import { Repository, getRepository } from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/Users';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  /**
   * findByEmail
   */
  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { email } });

    return user;
  }

  /**
   * findById
   */
  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }

  /**
   * create
   */
  public async create({
    email,
    name,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({ email, name, password });

    await this.ormRepository.save(user);

    return user;
  }

  /**
   * save
   */
  public async save(data: ICreateUserDTO): Promise<User> {
    const user = await this.ormRepository.save(data);

    return user;
  }
}

export default UsersRepository;
