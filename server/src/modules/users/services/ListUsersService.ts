import { AppError } from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'

import { User } from '../infra/prisma/entities/User'
import { IUsersRepository } from '../repositories/IUsersRepository'

interface IServiceProps {
  page?: number
  perPage?: number
  search?: string
}

@injectable()
export class ListUsersService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({
    page,
    perPage,
    search,
  }: IServiceProps): Promise<User[]> {
    const usersList = await this.usersRepository.list({
      page,
      perPage,
      search,
    })

    return usersList
  }
}
