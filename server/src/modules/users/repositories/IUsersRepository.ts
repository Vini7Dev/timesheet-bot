import { ICreateUserDTO } from '../dtos/ICreateUserDTO';
import { IListUsersDTO } from '../dtos/IListUsersDTO';
import { IUpdateUserDTO } from '../dtos/IUpdateUserDTO';
import { User } from '../infra/prisma/entities/User';

export interface IUsersRepository {
  findById(id: string): Promise<User | null>
  findByUsernameOrEmail(data: { email?: string, username?: string }): Promise<User | null>
  list(filters: IListUsersDTO): Promise<User[]>
  create(data: ICreateUserDTO): Promise<User>
  update(data: IUpdateUserDTO): Promise<User>
  delete(id: string): Promise<string>
}
