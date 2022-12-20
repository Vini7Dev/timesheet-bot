interface ICalculateTotalHoursOfMarkingProps {
  date: string
  startTime: string
  finishTime: string
  startIntervalTime?: string
  finishIntervalTime?: string
}

export const calculateTotalHoursOfMarking = ({
  date,
  startTime,
  finishTime,
  startIntervalTime,
  finishIntervalTime
}: ICalculateTotalHoursOfMarkingProps): number => {
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
