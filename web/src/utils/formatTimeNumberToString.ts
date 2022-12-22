interface IFormatTimeNumberToStringProps {
  timeStartedAt: number
  currentTime: number
  hideSecondsWhenHoursExist?: boolean
}

const formatPad = (value: number): string => {
  return value.toString().padStart(2, '0')
}

export const formatTimeNumberToString = ({
  timeStartedAt,
  currentTime,
  hideSecondsWhenHoursExist = false
}: IFormatTimeNumberToStringProps): string => {
  if (isNaN(currentTime)) {
    return ''
  }

  const updatedTimerNow = currentTime - (timeStartedAt ?? 0)

  const seconds = Math.floor((updatedTimerNow / 1000) % 60)
  const minutes = Math.floor((updatedTimerNow / (1000 * 60)) % 60)
  const hours = Math.floor((updatedTimerNow / (1000 * 60 * 60)) % 24)

  if (hours > 0) {
    if (hideSecondsWhenHoursExist) {
      return `${formatPad(hours)}:${formatPad(minutes)}`
    }

    return `${formatPad(hours)}:${formatPad(minutes)}:${formatPad(seconds)}`
  }

  return `${formatPad(minutes)}:${formatPad(seconds)}`
}
