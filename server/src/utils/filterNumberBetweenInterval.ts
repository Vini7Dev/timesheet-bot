interface IFilterNumberBetweenInterval {
  startNumberInterval: number
  finishNumberInterval: number
  numbersToVerify: number[]
}

export const filterNumberBetweenInterval = (
  {
    startNumberInterval,
    finishNumberInterval,
    numbersToVerify,
  }: IFilterNumberBetweenInterval
): number[] => {
  return numbersToVerify.filter(numberToVerify =>
    numberToVerify > startNumberInterval && numberToVerify < finishNumberInterval
  )
}
