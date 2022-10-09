import { ICreateUserDTO } from '../dtos/ICreateUserDTO';
import { User } from '../infra/prisma/entities/User';

export interface IUsersRepository {
  findByUsernameOrEmail(data: { email: string, username: string }): Promise<User | null>
  list(filters: { page?: number, perPage?: number }): Promise<User[]>
  create(data: ICreateUserDTO): Promise<User>
}
