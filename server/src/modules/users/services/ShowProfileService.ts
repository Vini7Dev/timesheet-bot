import { AppError } from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'

import { User } from '../infra/prisma/entities/User'
import { IUsersRepository } from '../repositories/IUsersRepository'

interface IServiceProps {
  userId: string
  authenticatedUserId: string
}

@injectable()
export class ShowProfileService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({
    userId,
    authenticatedUserId
  }: IServiceProps): Promise<User | null> {
    if (userId !== authenticatedUserId) {
      throw new AppError('You do not have permission to view this profile!', 403)
    }

    const userData = await this.usersRepository.findById(userId)

    return userData
  }
}
