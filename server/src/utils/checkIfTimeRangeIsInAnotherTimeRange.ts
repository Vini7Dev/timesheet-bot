interface ICheckIfTimeRangeIsInAnotherTimeRangeProps {
  startNumber: number
  finishNumber: number
  compareStartNumber: number
  compareFinishNumber: number
}

export const checkIfTimeRangeIsInAnotherTimeRange = (
  {
    startNumber,
    finishNumber,
    compareStartNumber,
    compareFinishNumber
  }: ICheckIfTimeRangeIsInAnotherTimeRangeProps
): boolean => {
  if (
    startNumber <= compareStartNumber && finishNumber >= compareFinishNumber
  ) {
    return true
  } else if (
    finishNumber <= compareFinishNumber && finishNumber > compareStartNumber
  ) {
    return true
  } else if (
    startNumber >= compareStartNumber && startNumber < compareFinishNumber
  ) {
    return true
  }

  return false
}
