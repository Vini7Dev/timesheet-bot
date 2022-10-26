import 'dotenv/config'

import { SeleniumProvider } from '@shared/containers/providers/Crawler/implementations/SeleniumProvider'

const MARKINGS = [
  {
    id: 'ID EXAMPLE 1',
    description: 'DESCRIPTION EXAMPLE 1',
    date: '26/10/2022',
    start_time: '09:30',
    finish_time: '10:30',
    start_interval_time: '10:00',
    finish_interval_time: '10:10',
    work_class: 'PRODUCTION',
    custumer_code: '1090',
    project_code: 'KC3705',
  },
  {
    id: 'ID EXAMPLE 2',
    description: 'DESCRIPTION EXAMPLE 2',
    date: '26/10/2022',
    start_time: '12:00',
    finish_time: '14:00',
    work_class: 'ABSENCE',
    custumer_code: '1090',
    project_code: 'KC3705',
  },
]

const UPDATED_MARKINGS = [
  {
    id: 'ID EXAMPLE 1',
    description: 'UPDATED - DESCRIPTION EXAMPLE 1',
    date: '27/10/2022',
    start_time: '10:00',
    finish_time: '11:00',
    work_class: 'ABSENCE',
  },
  {
    id: 'ID EXAMPLE 2',
    description: 'UPDATED - DESCRIPTION EXAMPLE 2',
    date: '28/10/2022',
    start_time: '13:00',
    finish_time: '17:00',
    start_interval_time: '14:00',
    finish_interval_time: '15:00',
    work_class: 'PRODUCTION',
  },
]

const addMarkingCrawler = async () => {
  try {
    const seleniumProvider = new SeleniumProvider()

    await seleniumProvider.authenticateTimesheet({
      username: process.env.CRAWLER_USERNAME ?? 'jhon.doe',
      password: process.env.CRAWLER_PASSWORD ?? 'jhon123',
    })

    const response = await seleniumProvider.saveTimesheetTasks({
      markings: MARKINGS as any,
    })

    await seleniumProvider.stopCrawler()

    console.log('========> response', JSON.stringify(response, null, 2))
  } catch (err) {
    console.error('====> Error:', err)
  }
}

const updateMarkingCrawler = async () => {
  try {
    const seleniumProvider = new SeleniumProvider()

    await seleniumProvider.authenticateTimesheet({
      username: process.env.CRAWLER_USERNAME ?? 'jhon.doe',
      password: process.env.CRAWLER_PASSWORD ?? 'jhon123',
    })

    const response = await seleniumProvider.updateTimesheetTasks({
      markings: [
        {
          ...UPDATED_MARKINGS[0],
          on_timesheet_id: '1539724',
        },
        {
          ...UPDATED_MARKINGS[1],
          on_timesheet_id: '1539725',
        }
      ] as any,
    })

    await seleniumProvider.stopCrawler()

    console.log('========> response', JSON.stringify(response, null, 2))
  } catch (err) {
    console.error('====> Error:', err)
  }
}

const deleteMarkingCrawler = async () => {
  try {
    const seleniumProvider = new SeleniumProvider()

    await seleniumProvider.authenticateTimesheet({
      username: process.env.CRAWLER_USERNAME ?? 'jhon.doe',
      password: process.env.CRAWLER_PASSWORD ?? 'jhon123',
    })

    const response = await seleniumProvider.deleteTimesheetTasks({
      markings: [
        {
          ...MARKINGS[0],
          on_timesheet_id: '1539724',
        },
        {
          ...MARKINGS[1],
          on_timesheet_id: '1539725',
        }
      ] as any,
    })

    await seleniumProvider.stopCrawler()

    console.log('========> response', JSON.stringify(response, null, 2))
  } catch (err) {
    console.error('====> Error:', err)
  }
}

(async function () {
  // await addMarkingCrawler()
  await updateMarkingCrawler()
  // await deleteMarkingCrawler()
})()
