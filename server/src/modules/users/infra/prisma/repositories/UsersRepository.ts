import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO'
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { AppRepository } from '@shared/infra/prisma/repositories/AppRepository'
import { User } from '../entities/User'

export class UsersRepository extends AppRepository implements IUsersRepository {
  public async findById(id: string): Promise<User | null> {
    const findedUser = await this.client.users.findUnique({
      where: {
        id,
      }
    })

    return findedUser
  }

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

  public async list({
    page = 0,
    perPage = 10
  }: { page?: number, perPage?: number }): Promise<User[]> {
    const userList = await this.client.users.findMany({
      skip: page,
      take: perPage,
    })

    return userList
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
  public async delete(id: string): Promise<string> {
    await this.client.users.delete({
      where: {
        id,
      }
    })

    return id
  }
}
