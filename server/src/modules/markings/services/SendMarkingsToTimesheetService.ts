import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { inject, injectable } from 'tsyringe'

import { QueueControl } from '@shared/infra/bull/QueueControl'
import { AppError } from '@shared/errors/AppError'
import { IEncrypt } from '@shared/containers/providers/Encrypt/models/IEncrypt'
import { JOB_MARKINGS_ON_TIMESHEET } from '@utils/constants'
import { IMarkingsRepository } from '../repositories/IMarkingsRepository'
import { Marking } from '../infra/prisma/entities/Marking'

interface IMarkingResult {
  id: string
  data?: Marking
  error?: AppError
}

interface IServiceProps {
  markingIds: string[]
  authenticatedUserId: string
}

interface IServiceResponse {
  markings: IMarkingResult[]
}

@injectable()
export class SendMarkingsToTimesheetService {
  constructor (
    @inject('MarkingsRepository')
    private markingsRepository: IMarkingsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('EncryptProvider')
    private encryptProvider: IEncrypt,
  ) {}

  public async execute({
    authenticatedUserId,
    markingIds,
  }: IServiceProps): Promise<IServiceResponse> {
    const userOwner = await this.usersRepository.findById(authenticatedUserId)
    if (!userOwner) {
      throw new AppError('User not found!', 404)
    }

    const markingsFinded = await this.markingsRepository.listByIds(markingIds)

    const markingResults: IMarkingResult[] = []

    for (const markingId of markingIds) {
      const markingData = markingsFinded.find(marking => marking.id === markingId)

      if (!markingData) {
        markingResults.push({
          id: markingId,
          error: new AppError('Marking not found!', 404)
        })
      } else if (markingData.user_id !== userOwner.id) {
        markingResults.push({
          id: markingId,
          error: new AppError('You do not have permission to send this marking!', 403)
        })
      } else {
        markingResults.push({
          id: markingId,
          data: markingData
        })
      }
    }

    const markingsToProccess = markingResults
      .filter(markingResult => !markingResult.error)
      .map(markingResult => markingResult.data)

    await QueueControl.add({
      name: JOB_MARKINGS_ON_TIMESHEET,
      data: {
        markings: markingsToProccess,
        userCredentials: {
          user_id: userOwner.id,
          username: userOwner.username,
          password: this.encryptProvider.decrypt(userOwner.password),
        }
      }
    })

    return {
      markings: markingResults
    }
  }
}
