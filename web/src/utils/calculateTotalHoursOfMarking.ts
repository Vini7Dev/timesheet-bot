interface ICalculateTotalHoursOfMarkingProps {
  date: string
  startTime: string
  finishTime: string
  startIntervalTime?: string
  finishIntervalTime?: string
  deleted_at?: string
}

export const calculateTotalHoursOfMarking = ({
  date,
  startTime,
  finishTime,
  startIntervalTime,
  finishIntervalTime,
  deleted_at
}: ICalculateTotalHoursOfMarkingProps): number => {
  if (deleted_at) {
    return 0
  }

  const startTimeDate = new Date(`${date}T${startTime}:00`).getTime()
  const finishTimeDate = new Date(`${date}T${finishTime}:00`).getTime()

  const diffTime = (finishTimeDate - startTimeDate)

  if (startIntervalTime && finishIntervalTime) {
    const startIntervalTimeDate = new Date(`${date}T${startIntervalTime}:00`).getTime()
    const finishIntervalTimeDate = new Date(`${date}T${finishIntervalTime}:00`).getTime()

    const diffTimeInterval = (finishIntervalTimeDate - startIntervalTimeDate)

    return diffTime - diffTimeInterval
  }

  return diffTime
}
