import { inject, injectable } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'
import { IMarkingsRepository } from '../repositories/IMarkingsRepository'
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'

interface IServiceProps {
  authenticatedUserId: string
  marking_id: string
  options?: {
    clearTimesheetId?: boolean
  }
}

@injectable()
export class DeleteMarkingService {
  constructor (
    @inject('MarkingsRepository')
    private markingsRepository: IMarkingsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({
    authenticatedUserId,
    marking_id,
    options
  }: IServiceProps): Promise<string> {
    const authenticatedUser = await this.usersRepository.findById(authenticatedUserId)
    if (!authenticatedUser) {
      throw new AppError('User not found!', 404)
    }

    const markingToDelete = await this.markingsRepository.findById(marking_id)
    if (!markingToDelete) {
      throw new AppError('Marking not found!', 404)
    }

    if (markingToDelete.on_timesheet_status === 'SENDING') {
      throw new AppError('This marking is being processed in the timesheet!')
    }

    if (markingToDelete.user_id !== authenticatedUserId) {
      throw new AppError('You do not have permission to delete this marking!', 403)
    }

    const projectIdDeleted = await this.markingsRepository.delete(marking_id, {
      clearTimesheetId: options?.clearTimesheetId,
    })

    return projectIdDeleted
  }
}
