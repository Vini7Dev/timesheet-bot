import { ICreateUserDTO } from '../dtos/ICreateUserDTO';
import { User } from '../infra/prisma/entities/User';

export interface IUsersRepository {
  findByUsername(username: string): Promise<User | null>
  create(data: ICreateUserDTO): Promise<User>
}
