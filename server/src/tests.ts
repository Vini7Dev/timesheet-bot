import 'dotenv/config'

import { SeleniumProvider } from '@shared/containers/providers/Crawler/implementations/SeleniumProvider'

(async function () {
  try {
    const seleniumProvider = new SeleniumProvider()

    await seleniumProvider.authenticateTimesheet({
      username: process.env.CRAWLER_USERNAME ?? 'jhon.doe',
      password: process.env.CRAWLER_PASSWORD ?? 'jhon123',
    })

    await seleniumProvider.saveTimesheetTasks({
      markings: [
        {
          id: 'ID EXAMPLE 1',
          description: 'DESCRIPTION EXAMPLE 1',
          date: '20/10/2022',
          start_time: '09:00',
          finish_time: '12:00',
          start_interval_time: '10:00',
          finish_interval_time: '11:00',
          work_class: 'PRODUCTION',
          costumer_code: '1041',
          project_code: 'KC3539',
        },
        {
          id: 'ID EXAMPLE 2',
          description: 'DESCRIPTION EXAMPLE 2',
          date: '20/10/2022',
          start_time: '13:00',
          finish_time: '14:00',
          work_class: 'ABSENCE',
          costumer_code: '1041',
          project_code: 'KC3539',
        },
        {
          id: 'ID EXAMPLE 3',
          description: 'DESCRIPTION EXAMPLE 3',
          date: '21/10/2022',
          start_time: '09:00',
          finish_time: '12:00',
          start_interval_time: '10:00',
          finish_interval_time: '11:00',
          work_class: 'PRODUCTION',
          costumer_code: '1043',
          project_code: 'KC3553',
        },
      ],
    })

    await seleniumProvider.stopCrawler()
  } catch (err) {
    console.error('====> Error:', err)
  }
})()
