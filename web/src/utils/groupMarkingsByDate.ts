import { calculateTotalHoursOfMarking } from './calculateTotalHoursOfMarking'

interface IGroupMarkingsByDateResult {
  date: string
  markings: IMarkingData[]
  totalHours: number
}

export const groupMarkingsByDate = (
  markigns: IMarkingData[]
): IGroupMarkingsByDateResult[] => {
  const groups: IGroupMarkingsByDateResult[] = []

  for (const marking of markigns) {
    const indexOfGroup = groups.findIndex(group => group.date === marking.date)

    if (indexOfGroup === -1) {
      groups.push({
        date: marking.date,
        markings: [marking],
        totalHours: calculateTotalHoursOfMarking({
          date: marking.date,
          startTime: marking.start_time,
          finishTime: marking.finish_time,
          startIntervalTime: marking.start_interval_time,
          finishIntervalTime: marking.finish_interval_time
        })
      })
    } else {
      groups[indexOfGroup].markings.push(marking)

      groups[indexOfGroup].totalHours += calculateTotalHoursOfMarking({
        date: marking.date,
        startTime: marking.start_time,
        finishTime: marking.finish_time,
        startIntervalTime: marking.start_interval_time,
        finishIntervalTime: marking.finish_interval_time
      })
    }
  }

  return groups
}
