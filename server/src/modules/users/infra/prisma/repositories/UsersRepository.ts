import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO'
import { IListUsersDTO } from '@modules/users/dtos/IListUsersDTO'
import { IUpdateUserDTO } from '@modules/users/dtos/IUpdateUserDTO'
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { AppRepository } from '@shared/infra/prisma/repositories/AppRepository'
import { User } from '../entities/User'

export class UsersRepository extends AppRepository implements IUsersRepository {
  public async findById(id: string): Promise<User | null> {
    const findedUser = await this.client.users.findFirst({
      where: {
        id,
        deleted_at: null
      }
    })

    return findedUser
  }

  public async findByUsernameOrEmail({
    email, username,
  }: { email?: string, username?: string }): Promise<User | null> {
    const findedUser = await this.client.users.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
        AND: {
          deleted_at: null
        }
      },
    })

    return findedUser
  }

  public async list({
    page = 0,
    perPage = 10,
    search,
  }: IListUsersDTO): Promise<User[]> {
    const userList = await this.client.users.findMany({
      skip: page,
      take: perPage,
      where: {
        name: { contains: search, mode: 'insensitive' },
        deleted_at: null
      }
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

  public async update({
    id,
    name,
    email,
    username,
    password,
  }: IUpdateUserDTO): Promise<User> {
    const updatedUser = await this.client.users.update({
      where: { id },
      data: {
        name,
        email,
        username,
        password,
        updated_at: new Date()
      }
    })

    return updatedUser
  }

  public async delete(id: string): Promise<string> {
    await this.client.users.update({
      data: { deleted_at: new Date() },
      where: { id }
    })

    return id
  }
}
