import { WorkClass } from '@prisma/client'

interface IMarking {
  id: string
  description: string
  date: string
  start_time: string
  finish_time: string
  start_interval_time?: string | null
  finish_interval_time?: string | null
  work_class: WorkClass
  custumer_code: string
  project_code: string
}

interface IGroupMarkingsByMonth {
  month: string
  markings: IMarking[]
}

interface IGroupMarkingsByYear {
  year: string
  months: IGroupMarkingsByMonth[]
}

export const groupMarkingsByMonth = (markings: IMarking[]): IGroupMarkingsByYear[] => {
  const markingsGroup: IGroupMarkingsByYear[] = []

  for (const marking of markings) {
    const [, markingMonth, markingYear] = marking.date.split('/')

    const groupYearIndex = markingsGroup.findIndex(
      markingGroup => markingGroup.year === markingYear
    )

    if(groupYearIndex === -1) {
      markingsGroup.push({
        year: markingYear,
        months: [{
          month: markingMonth,
          markings: [marking]
        }]
      })
    } else {
      const markingGroupYear = markingsGroup[groupYearIndex] as IGroupMarkingsByYear

      const groupMonthIndex = markingGroupYear.months.findIndex(
        markingGroup => markingGroup.month === markingMonth
      )

      if(groupMonthIndex === -1) {
        markingGroupYear.months.push({
          month: markingMonth,
          markings: [marking]
        })
      } else {
        markingGroupYear.months[groupMonthIndex].markings.push(marking)
      }

      markingsGroup[groupYearIndex] = markingGroupYear
    }
  }

  return markingsGroup
}
