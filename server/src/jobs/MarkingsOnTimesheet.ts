import { JOB_MARKINGS_ON_TIMESHEET } from '@utils/constants'
import { Marking } from '@modules/markings/infra/prisma/entities/Marking'
import { SeleniumProvider } from '@shared/containers/providers/Crawler/implementations/SeleniumProvider'
import { IUpdateMarkingsDTO } from '@shared/containers/providers/Crawler/dtos/IUpdateMarkingsDTO'
import { IDeleteMarkingsDTO } from '@shared/containers/providers/Crawler/dtos/IDeleteMarkingsDTO'

interface IJobMarkingsOnTimesheetProps {
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
  handle: async ({ data: {
    userCredentials: { user_id, username, password },
    markings,
  } }: IJobMarkingsOnTimesheetProps) => {
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

    const crawler = new SeleniumProvider()

    try {
      // Authenticate on Timesheet
      await crawler.authenticateTimesheet({
        username,
        password,
      })

      // Saving markins
      const createdMarkings = await crawler.saveTimesheetTasks({
        markings: actionGroups.save.map(marking => ({
          ...marking,
          project_code: marking.project?.code ?? '',
          custumer_code: marking.project?.customer?.code ?? '',
        })),
      })

      // Update markins
      const updatedMarkings = await crawler.updateTimesheetTasks({
        markings: actionGroups.update,
      } as IUpdateMarkingsDTO)

      // Delete markins
      const deletedMarkings = await crawler.deleteTimesheetTasks({
        markings: actionGroups.delete,
      } as IDeleteMarkingsDTO)

      // Close crawler
      await crawler.stopCrawler()

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

      return crawlerResponses
    } catch (err) {
      console.error(`${new Date()} - ${err}`)
    } finally {
      // Close crawler
      await crawler.stopCrawler()
    }
  }
}
