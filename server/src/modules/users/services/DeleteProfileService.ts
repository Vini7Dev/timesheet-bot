import { AppError } from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '../repositories/IUsersRepository'

interface IServiceProps {
  user_id: string
  authenticatedUserId: string
}

@injectable()
export class DeleteProfileService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({
    user_id,
    authenticatedUserId,
  }: IServiceProps): Promise<string> {
    const userToDelete = await this.usersRepository.findById(user_id)
    if (!userToDelete) {
      throw new AppError('User not found!', 404)
    }

    if (userToDelete.id !== authenticatedUserId) {
      throw new AppError('You do not have permission to delete this profile!', 403)
    }

    const userIdDeleted = await this.usersRepository.delete(user_id)

    return userIdDeleted
  }
}
