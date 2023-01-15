import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { Marking } from '../infra/prisma/entities/Marking'
import { IMarkingsRepository } from '../repositories/IMarkingsRepository'
import { AppError } from '@shared/errors/AppError'

interface IServiceProps {
  authenticatedUserId: string,
  page?: number
  perPage?: number
  search?: string
}

@injectable()
export class ListMarkingsByUserService {
  constructor (
    @inject('MarkingsRepository')
    private markingsRepository: IMarkingsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    authenticatedUserId,
    page,
    perPage,
    search,
  }: IServiceProps): Promise<Marking[]> {
    const userOwner = await this.usersRepository.findById(authenticatedUserId)

    if (!userOwner) {
      throw new AppError('User not found!', 404)
    }

    const markingsList = await this.markingsRepository.listByUserId({
      user_id: authenticatedUserId,
      page,
      perPage,
      search,
    })

    return markingsList
  }
}
