const FIRST_INDEX_OF_TIME_INPUT_VALUE = 0
const INDEX_OF_MIDDLE_TIME_INPUT_VALUE = 2
const MAX_SIZE_OF_TIME_INPUT_VALUE = 5

export const formatTimeInputValue = (inputValue: string): string => {
  const inputValueFormatted = inputValue
    .substring(FIRST_INDEX_OF_TIME_INPUT_VALUE, MAX_SIZE_OF_TIME_INPUT_VALUE)
    .replace(':', '')

  const hours = inputValueFormatted.substring(
    FIRST_INDEX_OF_TIME_INPUT_VALUE,
    INDEX_OF_MIDDLE_TIME_INPUT_VALUE
  )

  const minutes = inputValueFormatted.substring(
    INDEX_OF_MIDDLE_TIME_INPUT_VALUE,
    MAX_SIZE_OF_TIME_INPUT_VALUE
  )

  return `${hours}:${minutes}`
}
