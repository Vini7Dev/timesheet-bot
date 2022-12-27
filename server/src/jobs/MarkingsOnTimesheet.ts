import { JOB_MARKINGS_ON_TIMESHEET } from '@utils/constants'
import { Marking } from '@modules/markings/infra/prisma/entities/Marking'
import { SeleniumProvider } from '@shared/containers/providers/Crawler/implementations/SeleniumProvider'

interface IJobMarkingsOnTimesheetProps {
  data: {
    markings: Marking[]
    userCredentials: {
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
    userCredentials: { username, password },
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
      await crawler.saveTimesheetTasks({
        markings: actionGroups.save.map(marking => ({
          ...marking,
          project_code: marking.project?.code ?? '',
          custumer_code: marking.project?.customer?.code ?? '',
        })),
      })

      // Close crawler
      await crawler.stopCrawler()
    } catch (err) {
      console.error(`${new Date()} - ${err}`)
    } finally {
      // Close crawler
      await crawler.stopCrawler()
    }
  }
}
