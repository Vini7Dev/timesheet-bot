import { OnTimesheetStatus } from '@prisma/client'

import { JOB_MARKINGS_ON_TIMESHEET, TRIGGER_MARKINGS_TO_TIMESHEET } from '@utils/constants'
import { AppError } from '@shared/errors/AppError'
import { ICrawler } from '@shared/containers/providers/Crawler/models/ICrawler'
import { IEncrypt } from '@shared/containers/providers/Encrypt/models/IEncrypt'
import { IHandleProps } from '@shared/containers/providers/Queue/implementations/BullProvider'
import { IUpdateMarkingsDTO } from '@shared/containers/providers/Crawler/dtos/IUpdateMarkingsDTO'
import { IDeleteMarkingsDTO } from '@shared/containers/providers/Crawler/dtos/IDeleteMarkingsDTO'
import { IMarkingsRepository } from '@modules/markings/repositories/IMarkingsRepository'
import { Marking } from '@modules/markings/infra/prisma/entities/Marking'
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'

interface IJobMarkingsOnTimesheetProps extends IHandleProps {
  providers: {
    usersRepository: IUsersRepository
    markingsRepository: IMarkingsRepository
    crawlerProvider: ICrawler
    encryptProvider: IEncrypt
  }
  data: {
    userOwnerId: string
    markings: Marking[]
  }
}

interface IActionGroups {
  save: Marking[]
  update: Marking[]
  delete: Marking[]
}

interface IUpdatedMarkingsToClientProps {
  id: string
  on_timesheet_status: OnTimesheetStatus
  timesheet_error: string | null | undefined
}

export default {
  key: JOB_MARKINGS_ON_TIMESHEET,
  handle: async ({
    pubSub,
    providers: {
      usersRepository,
      markingsRepository,
      crawlerProvider,
      encryptProvider,
    },
    data: {
      userOwnerId,
      markings,
    },
  }: IJobMarkingsOnTimesheetProps) => {
    const userOwner = await usersRepository.findById(userOwnerId)
    if (!userOwner) {
      throw new AppError('User not found!', 404)
    }

    for (const marking of markings) {
      if (marking.user_id !== userOwner.id) {
        throw new AppError('You do not have permission to send one of these marking!', 403)
      }

      if (marking.on_timesheet_status === 'SENDING') {
        throw new AppError('One of these markings is being processed in the timesheet!')
      }
    }

    const actionGroups: IActionGroups = {
      save: [],
      update: [],
      delete: [],
    }

    for (const marking of markings) {
      if (!marking.on_timesheet_id) {
        actionGroups.save.push(marking)
      } else if (marking.deleted_at) {
        actionGroups.delete.push(marking)
      } else {
        actionGroups.update.push(marking)
      }
    }

    let updatedMarkingsToClient: IUpdatedMarkingsToClientProps[] = []

    try {
      await crawlerProvider.authenticateOnTimesheet({
        username: userOwner.username,
        password: encryptProvider.decrypt(userOwner.password),
      })

      const deletedMarkings = await crawlerProvider.deleteTimesheetTasks({
        markings: actionGroups.delete,
      } as IDeleteMarkingsDTO)

      const updatedMarkings = await crawlerProvider.updateTimesheetTasks({
        markings: actionGroups.update,
      } as IUpdateMarkingsDTO)

      const createdMarkings = await crawlerProvider.saveTimesheetTasks({
        markings: actionGroups.save.map(marking => ({
          ...marking,
          project_code: marking.project?.code!,
          custumer_code: marking.project?.customer?.code!,
        })),
      })

      await crawlerProvider.closeCrawler()

      const crawlerResponses = {
        user_id: userOwner.id,
        markingsResponse: [
          ...createdMarkings.markingsResponse,
          ...updatedMarkings.markingsResponse,
          ...deletedMarkings.markingsResponse,
        ],
        otherErrors: [
          createdMarkings.otherError,
          updatedMarkings.otherError,
          deletedMarkings.otherError,
        ]
      }

      const updatedMarkingsStatus = await markingsRepository.updateManyTimesheetStatus({
        markingsStatus: crawlerResponses.markingsResponse.map(marking => ({
          marking_id: marking.id,
          on_timesheet_id: marking.on_timesheet_id,
          on_timesheet_status: marking.on_timesheet_status,
          timesheet_error: marking?.timesheet_error?.join(';')
        }))
      })

      updatedMarkingsToClient = updatedMarkingsStatus.markingsStatus.map(marking => ({
        id: marking.marking_id,
        on_timesheet_status: marking.on_timesheet_status,
        timesheet_error: marking.timesheet_error,
      }))

    } catch {
      await crawlerProvider.closeCrawler()

      updatedMarkingsToClient = markings.map(marking => ({
        id: marking.id,
        on_timesheet_status: 'NOT_SENT',
        timesheet_error: marking.timesheet_error,
      }))
    } finally {
      await pubSub.publish(TRIGGER_MARKINGS_TO_TIMESHEET, {
        onSendMarkingsToTimesheet: updatedMarkingsToClient,
        userOwnerId: userOwner.id,
      })
    }
  }
}
