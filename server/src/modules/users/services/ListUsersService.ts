import { AppError } from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'

import { User } from '../infra/prisma/entities/User'
import { IUsersRepository } from '../repositories/IUsersRepository'

interface IServiceProps {
  page?: number
  perPage?: number,
  authenticatedUserId: string
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
    authenticatedUserId,
  }: IServiceProps): Promise<User[]> {
    const authenticatedUser = await this.usersRepository.findById(authenticatedUserId)

    if (!authenticatedUser) {
      throw new AppError('You must be authenticated!', 401)
    }

    const usersList = await this.usersRepository.list({ page, perPage })

    return usersList
  }
}
