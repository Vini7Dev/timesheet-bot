import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO'
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { AppRepository } from '@shared/infra/prisma/repositories/AppRepository'
import { User } from '../entities/User'

export class UsersRepository extends AppRepository implements IUsersRepository {
  public async findByUsernameOrEmail({
    email, username,
  }: { email: string, username: string }): Promise<User | null> {
    const findedUser = await this.client.users.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    })

    return findedUser
  }

  public async list(filters: { page?: number, perPage?: number }): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  public async create({
    name,
    email,
    username,
    password,
  }: ICreateUserDTO): Promise<User> {
    const createdUser = await this.client.users.create({
      data: { name, email, username, password }
    })

    return createdUser
  }
}
