interface IGetOrdenationValueProps<T = number | string> {
  compareA: T
  compareB: T
}

export const getOrdenationValue = <T = number | string>(
  { compareA, compareB }: IGetOrdenationValueProps<T>
): -1 | 0 | 1 => {
  if (compareA < compareB) {
    return -1
  } else if (compareA > compareB) {
    return 1
  } else {
    return 0
  }
}

export const orderMarkingsByTime = (markings: IMarkingData[]): IMarkingData[] => {
  return markings.sort((markingA, maarkingB) => {
    const startTimeDateA = new Date(`${markingA.date}T${markingA.start_time}:00`).getTime()
    const startTimeDateB = new Date(`${maarkingB.date}T${maarkingB.finish_time}:00`).getTime()

    return getOrdenationValue({
      compareA: startTimeDateA,
      compareB: startTimeDateB
    })
  }).reverse()
}
