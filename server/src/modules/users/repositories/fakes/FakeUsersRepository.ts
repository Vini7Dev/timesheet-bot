import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import { User } from '../../infra/prisma/entities/User';

import { IUsersRepository } from '../IUsersRepository';

export class FakeUsersRepository implements IUsersRepository {
  private users: User[]

  constructor () {
    this.users = []
  }

  public async findById(id: string): Promise<User | null> {
    const findedUser = this.users.find(user => user.id === id)

    return findedUser ?? null
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
    page = 0,
    perPage = 10,
  }: { page?: number, perPage?: number }): Promise<User[]> {
    const filteredUsers = this.users.slice(page, perPage + page)

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