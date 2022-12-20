export const orderMarkingsByTime = (markings: IMarkingData[]): IMarkingData[] => {
  return markings.sort((markingA, maarkingB) => {
    const startTimeDateA = new Date(`${markingA.date}T${markingA.start_time}:00`).getTime()
    const startTimeDateB = new Date(`${maarkingB.date}T${maarkingB.finish_time}:00`).getTime()

    if (startTimeDateA < startTimeDateB) {
      return -1
    } else if (startTimeDateA > startTimeDateB) {
      return 1
    } else {
      return 0
    }
  })
}
