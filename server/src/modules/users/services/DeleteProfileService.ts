import { AppError } from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '../repositories/IUsersRepository'

interface IServiceProps {
  userId: string
  authenticatedUserId: string
}

@injectable()
export class DeleteProfileService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({
    userId,
    authenticatedUserId,
  }: IServiceProps): Promise<string> {
    const userToDelete = await this.usersRepository.findById(userId)
    if (!userToDelete) {
      throw new AppError('User not found!', 404)
    }

    if (userToDelete.id !== authenticatedUserId) {
      throw new AppError('You do not have permission to delete this profile!', 403)
    }

    const userIdDeleted = await this.usersRepository.delete(userId)

    return userIdDeleted
  }
}
