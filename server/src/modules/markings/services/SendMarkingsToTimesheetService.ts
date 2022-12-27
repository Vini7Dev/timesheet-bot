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

    const markingResults: IMarkingResult[] = []

    for (const markingId of markingIds) {
      const markingData = await this.markingsRepository.findById(markingId)

      const markingResult: IMarkingResult = {
        id: markingId
      }

      if (!markingData) {
        markingResult.error = new AppError('Marking not found!', 404)
      } else if (markingData.user_id !== userOwner.id) {
        markingResult.error = new AppError('You do not have permission to send this marking!', 403)
      } else {
        markingResult.data = markingData
      }

      markingResults.push(markingResult)
    }

    const markingsToProccess = markingResults
      .filter(markingResult => !markingResult.error)
      .map(markingResult => markingResult.data)

    await QueueControl.add({
      name: JOB_MARKINGS_ON_TIMESHEET,
      data: {
        markings: markingsToProccess,
        userCredentials: {
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
