import { formatPad } from './formatPad'

interface IFormatTimeNumberToStringProps {
  timeStartedAt: number
  currentTime: number
  hideSecondsWhenHoursExist?: boolean
  forceToShowHours?: boolean
}

export const formatTimeNumberToString = ({
  timeStartedAt,
  currentTime,
  hideSecondsWhenHoursExist = false,
  forceToShowHours = false
}: IFormatTimeNumberToStringProps): string => {
  if (isNaN(currentTime)) {
    return ''
  }

  const updatedTimerNow = currentTime - (timeStartedAt ?? 0)

  const seconds = Math.floor((updatedTimerNow / 1000) % 60)
  const minutes = Math.floor((updatedTimerNow / (1000 * 60)) % 60)
  const hours = Math.floor((updatedTimerNow / (1000 * 60 * 60)) % 24)

  if (hours > 0 || forceToShowHours) {
    if (hideSecondsWhenHoursExist) {
      return `${formatPad(hours)}:${formatPad(minutes)}`
    }

    return `${formatPad(hours)}:${formatPad(minutes)}:${formatPad(seconds)}`
  }

  return `${formatPad(minutes)}:${formatPad(seconds)}`
}
