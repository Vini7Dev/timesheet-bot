import { AppError } from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'

import { User } from '../infra/prisma/entities/User'
import { IUsersRepository } from '../repositories/IUsersRepository'

interface IServiceProps {
  user_id: string
  authenticatedUserId: string
}

@injectable()
export class ShowProfileService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({
    user_id,
    authenticatedUserId
  }: IServiceProps): Promise<User> {
    const userData = await this.usersRepository.findById(user_id)

    if (!userData) {
      throw new AppError('User not found!', 404)
    }

    if (userData.id !== authenticatedUserId) {
      throw new AppError('You do not have permission to view this profile!', 403)
    }

    return userData
  }
}
