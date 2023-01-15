import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import { IListUsersDTO } from '@modules/users/dtos/IListUsersDTO';
import { IUpdateUserDTO } from '@modules/users/dtos/IUpdateUserDTO';
import { AppError } from '@shared/errors/AppError';
import { User } from '../../infra/prisma/entities/User';

import { IUsersRepository } from '../IUsersRepository';

interface ISearchValidationProps {
  value: string
  search: string
}

export class FakeUsersRepository implements IUsersRepository {
  private users: User[]

  constructor () {
    this.users = []
  }

  private searchValidation({ value, search }: ISearchValidationProps): boolean {
    return value.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  }

  public async findById(id: string): Promise<User | null> {
    const findedUser = this.users.find(user => user.id === id && !user.deleted_at)

    return findedUser ?? null
  }

  public async findByUsernameOrEmail({
    email, username
  }: { email?: string, username?: string }): Promise<User | null> {
    const findedUser = this.users.find(
      user => (user.email === email || user.username === username) && !user.deleted_at
    )

    return findedUser ? findedUser : null
  }

  public async list({
    page = 0,
    perPage = 10,
    search,
  }: IListUsersDTO): Promise<User[]> {
    const filteredUsers = this.users
      .filter(user => !user.deleted_at)
      .slice(page, perPage + page)

    if (search) {
      return filteredUsers.filter(
        user => this.searchValidation({ value: user.name, search })
          || this.searchValidation({ value: user.email, search })
          || this.searchValidation({ value: user.username, search })
      )
    }

    return filteredUsers
  }

  public async create({
    name,
    email,
    username,
    password,
  }: ICreateUserDTO): Promise<User> {
    const createDate = new Date()

    const createdUser = {
      id: Math.random().toString(),
      name,
      email,
      username,
      password,
      created_at: createDate,
      updated_at: createDate,
    }

    this.users.push(createdUser)

    return createdUser
  }

  public async update({
    id,
    name,
    email,
    username,
    password,
  }: IUpdateUserDTO): Promise<User> {
    const userToUpdateIndex = this.users.findIndex(user => user.id === id)

    if(userToUpdateIndex === -1) {
      throw new AppError('User not found!', 404)
    }

    const updatedUser = this.users[userToUpdateIndex]
    if (name) updatedUser.name = name
    if (email) updatedUser.email = email
    if (username) updatedUser.username = username
    if (password) updatedUser.password = password
    updatedUser.updated_at = (new Date(Date.now() + 10000))

    this.users[userToUpdateIndex] = updatedUser

    return updatedUser
  }

  public async delete(id: string): Promise<string> {
    const userToDeleteIndex = this.users.findIndex(user => user.id === id)

    if(userToDeleteIndex !== -1) {
      this.users[userToDeleteIndex].deleted_at = new Date()
    }

    return id
  }
}
