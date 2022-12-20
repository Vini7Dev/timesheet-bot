import { createContext, useCallback, useContext, useState } from 'react'
import { formatTimeNumberToString } from '../utils/formatTimeNumberToString'

interface IStopTimerResponse {
  startedAt: number
  stoppedAt: number
}

interface ITimerContext {
  timerRunning: boolean
  getTimerFormated: () => string
  getStartTimerFormated: () => string
  startTimer: () => void
  stopTimer: () => IStopTimerResponse
  changeStartTime: (newStartTime: number) => void
}

const TimerContext = createContext<ITimerContext>({} as unknown as ITimerContext)

// eslint-disable-next-line react/prop-types
export const TimerProvider: React.FC<any> = ({ children }) => {
  const [timerRunning, setTimerRunning] = useState(false)
  const [timer, setTimer] = useState(0)
  const [timerStartedAt, setTimerStartedAt] = useState(0)
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timer>()

  const formatPad = useCallback((value: number): string => {
    return value.toString().padStart(2, '0')
  }, [])

  const getTimerFormated = useCallback((): string => {
    return formatTimeNumberToString({
      timeStartedAt: timerStartedAt,
      currentTime: timer
    })
  }, [timer, timerStartedAt])

  const getStartTimerFormated = useCallback(() => {
    const startetTimerDate = new Date(timerStartedAt)

    const hours = startetTimerDate.getHours()
    const minutes = startetTimerDate.getMinutes()

    return `${formatPad(hours)}:${formatPad(minutes)}`
  }, [formatPad, timerStartedAt])

  const startTimer = useCallback(() => {
    setTimerStartedAt(Date.now())
    setTimer(Date.now())
    setTimerRunning(true)

    const timerIntervalToSave = setInterval(() => setTimer(Date.now()), 1000)

    setTimerInterval(timerIntervalToSave)
  }, [])

  const stopTimer = useCallback(() => {
    clearInterval(timerInterval)
    setTimerRunning(false)

    return {
      startedAt: timerStartedAt,
      stoppedAt: Date.now()
    }
  }, [timerInterval, timerStartedAt])

  const changeStartTime = useCallback((newStartTime: number) => {
    setTimerStartedAt(newStartTime)
  }, [])

  return (
    <TimerContext.Provider value={{
      timerRunning,
      getTimerFormated,
      getStartTimerFormated,
      startTimer,
      stopTimer,
      changeStartTime
    }}>
      {children}
    </TimerContext.Provider>
  )
}

export const useTimer = (): ITimerContext => {
  const context = useContext(TimerContext)

  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider.')
  }

  return context
}
