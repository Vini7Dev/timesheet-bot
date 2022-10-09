import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import { User } from '@modules/users/infra/prisma/entities/User';
import { Users } from '@prisma/client';

import { IUsersRepository } from '../IUsersRepository';

export class FakeUsersRepository implements IUsersRepository {
  private users: Users[]

  constructor () {
    this.users = []
  }

  public async findByUsernameOrEmail({
    email, username
  }: { email: string, username: string }): Promise<User | null> {
    const findedUser = this.users.find(
      user => user.email === email || user.username === username
    )

    return findedUser ?? null
  }

  public async list({
    page = 1,
    perPage = 10,
  }: { page?: number, perPage?: number }): Promise<User[]> {
    const filteredUsers = this.users.slice(page-1, perPage + page - 1)

    return filteredUsers
  }

  public async create({
    name,
    email,
    username,
    password,
  }: ICreateUserDTO): Promise<User> {
    const createdUser = {
      id: Math.random().toString(),
      name,
      email,
      username,
      password,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.users.push(createdUser)

    return createdUser
  }
}
