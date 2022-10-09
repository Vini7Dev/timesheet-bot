import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO'
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { AppRepository } from '@shared/infra/prisma/repositories/AppRepository'
import { User } from '../entities/User'

export class UsersRepository extends AppRepository implements IUsersRepository {
  public async findByUsername(username: string): Promise<User | null> {
    const findedUser = await this.client.users.findFirst({
      where: { username }
    })

    return findedUser
  }

  public async create({
    name,
    username,
    password,
  }: ICreateUserDTO): Promise<User> {
    const createdUser = await this.client.users.create({
      data: { name, username, password }
    })

    return createdUser
  }
}
