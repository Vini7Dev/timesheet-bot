import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { inject, injectable } from 'tsyringe'

import { IQueue } from '@shared/containers/providers/Queue/models/IQueue'
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

    @inject('QueueProvider')
    private queueProvider: IQueue,
  ) {}

  public async execute({
    authenticatedUserId,
    markingIds,
  }: IServiceProps): Promise<IServiceResponse> {
    const userOwner = await this.usersRepository.findById(authenticatedUserId)
    if (!userOwner) {
      throw new AppError('User not found!', 404)
    }

    const userWithSendingMarkings = await this.markingsRepository.listByUserId({
      user_id: userOwner.id,
      on_timesheet_status: 'SENDING'
    })

    if (userWithSendingMarkings.length !== 0) {
      throw new AppError('Wait for your markings to finish sending!')
    }

    const markingsFinded = await this.markingsRepository.listByIds({
      ids: markingIds,
      ignore_deleted_at: true,
    })

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
      .filter(markingResult => !markingResult.error && markingResult.data)
      .map(markingResult => markingResult.data) as Marking[]

    await this.queueProvider.add({
      name: JOB_MARKINGS_ON_TIMESHEET,
      data: {
        userOwnerId: userOwner.id,
        markings: markingsToProccess,
      }
    })

    await this.markingsRepository.updateManyTimesheetStatus({
      markingsStatus: markingsToProccess.map(markingToProcess => ({
        marking_id: markingToProcess?.id,
        on_timesheet_id: markingToProcess.on_timesheet_id,
        on_timesheet_status: 'SENDING',
        timesheet_error: ''
      }))
    })

    return {
      markings: markingResults
    }
  }
}
