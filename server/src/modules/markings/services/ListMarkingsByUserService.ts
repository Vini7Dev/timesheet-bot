import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { Marking } from '../infra/prisma/entities/Marking'
import { IMarkingsRepository } from '../repositories/IMarkingsRepository'
import { AppError } from '@shared/errors/AppError'

interface IServiceProps {
  user_id: string
  page?: number
  perPage?: number
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
    user_id,
    page,
    perPage,
  }: IServiceProps): Promise<Marking[]> {
    const userOwner = await this.usersRepository.findById(user_id)

    if (!userOwner) {
      throw new AppError('User not found!', 404)
    }

    const markingsList = await this.markingsRepository.listByUserId({
      user_id,
      page,
      perPage,
    })

    return markingsList
  }
}
