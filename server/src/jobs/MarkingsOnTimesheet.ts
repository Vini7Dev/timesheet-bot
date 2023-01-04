import { JOB_MARKINGS_ON_TIMESHEET, TRIGGER_MARKINGS_TO_TIMESHEET } from '@utils/constants'
import { ICrawler } from '@shared/containers/providers/Crawler/models/ICrawler'
import { IHandleProps } from '@shared/containers/providers/Queue/implementations/BullProvider'
import { IUpdateMarkingsDTO } from '@shared/containers/providers/Crawler/dtos/IUpdateMarkingsDTO'
import { IDeleteMarkingsDTO } from '@shared/containers/providers/Crawler/dtos/IDeleteMarkingsDTO'
import { IMarkingsRepository } from '@modules/markings/repositories/IMarkingsRepository'
import { Marking } from '@modules/markings/infra/prisma/entities/Marking'

interface IJobMarkingsOnTimesheetProps extends IHandleProps {
  providers: {
    markingsRepository: IMarkingsRepository
    crawlerProvider: ICrawler
  }
  data: {
    markings: Marking[]
    userCredentials: {
      user_id: string,
      username: string
      password: string
    }
  }
}

interface IActionGroups {
  save: Marking[]
  update: Marking[]
  delete: Marking[]
}

export default {
  key: JOB_MARKINGS_ON_TIMESHEET,
  handle: async ({
    pubsub,
    providers: {
      crawlerProvider,
      markingsRepository,
    },
    data: {
      userCredentials: { user_id, username, password },
      markings,
    },
  }: IJobMarkingsOnTimesheetProps) => {
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

    try {
      // Authenticate on Timesheet
      await crawlerProvider.authenticateTimesheet({
        username,
        password,
      })

      // Saving markins
      const createdMarkings = await crawlerProvider.saveTimesheetTasks({
        markings: actionGroups.save.map(marking => ({
          ...marking,
          project_code: marking.project?.code ?? '',
          custumer_code: marking.project?.customer?.code ?? '',
        })),
      })

      // Update markins
      const updatedMarkings = await crawlerProvider.updateTimesheetTasks({
        markings: actionGroups.update,
      } as IUpdateMarkingsDTO)

      // Delete markins
      const deletedMarkings = await crawlerProvider.deleteTimesheetTasks({
        markings: actionGroups.delete,
      } as IDeleteMarkingsDTO)

      // Close crawler
      await crawlerProvider.stopCrawler()

      // Build response
      const crawlerResponses = {
        user_id,
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
          timesheet_error: marking.timesheet_error ? marking.timesheet_error.join(';') : ''
        }))
      })

      const updatedMarkingsToClient = updatedMarkingsStatus.markingsStatus.map(marking => ({
        id: marking.marking_id,
        on_timesheet_status: marking.on_timesheet_status,
        timesheet_error: marking.timesheet_error,
      }))

      pubsub.publish(TRIGGER_MARKINGS_TO_TIMESHEET, {
        onSendMarkingsToTimesheet: updatedMarkingsToClient,
        userOwnerId: user_id,
      })

    } catch (err) {
      console.error(`${new Date()} - ${err}`)

      // Close crawler
      await crawlerProvider.stopCrawler()
    }
  }
}
