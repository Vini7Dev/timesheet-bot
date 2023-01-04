import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { browseSessionStorage } from '../utils/browseSessionStorage'
import { formatTimeNumberToString } from '../utils/formatTimeNumberToString'
import { formatPad } from '../utils/formatPad'

interface ITimerContext {
  timerRunning: boolean
  timerMarking: ITimerMarkingData
  getFormattedTimer: () => string
  getFormattedStartTime: () => string
  getFormattedNowTime: () => string
  startTimer: () => void
  stopTimer: () => void
  changeStartTime: (newStartTime: number) => void
  updateTimerMarkingData: (data: ITimerMarkingData) => void
  saveMarkingBkpOnSessionStorage: (data?: ITimerMarkingData) => void
}

interface ITimerMarkingData {
  description: string
  isBillable: boolean
  project?: IProjectProps
}

interface IStartTimerProps {
  timer: number
  timerStartedAt: number
  timerMarkingData: ITimerMarkingData
}

const TimerContext = createContext<ITimerContext>({} as unknown as ITimerContext)

// eslint-disable-next-line react/prop-types
export const TimerProvider: React.FC<any> = ({ children }) => {
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timer>()

  const [timerRunning, setTimerRunning] = useState(false)

  const [timer, setTimer] = useState(0)

  const [timerStartedAt, setTimerStartedAt] = useState(0)

  const [timerMarking, setTimerMarking] = useState<ITimerMarkingData>({
    description: '',
    isBillable: false
  })

  const updateTimerMarkingData = useCallback(({
    description,
    isBillable,
    project
  }: ITimerMarkingData) => {
    setTimerMarking({
      description,
      isBillable,
      project
    })
  }, [])

  const saveMarkingBkpOnSessionStorage = useCallback((timerMarkintToBKP?: ITimerMarkingData) => {
    browseSessionStorage.setItem({
      keyOrigin: 'timer',
      key: 'timerMarking',
      payload: timerMarkintToBKP ?? timerMarking
    })
  }, [timerMarking])

  const clearMarkingBkpFromSessionStorage = useCallback(() => {
    browseSessionStorage.removeItem({ keyOrigin: 'timer', key: 'timerMarking' })
    browseSessionStorage.removeItem({ keyOrigin: 'timer', key: 'timerStartedAt' })
    browseSessionStorage.removeItem({ keyOrigin: 'timer', key: 'timer' })
  }, [])

  const formatDateTime = useCallback((date: Date): string => {
    const hours = date.getHours()
    const minutes = date.getMinutes()

    return `${formatPad(hours)}:${formatPad(minutes)}`
  }, [])

  const getFormattedTimer = useCallback((): string => {
    return formatTimeNumberToString({
      timeStartedAt: timerStartedAt,
      currentTime: timer
    })
  }, [timer, timerStartedAt])

  const getFormattedStartTime = useCallback(() => {
    return formatDateTime(new Date(timerStartedAt))
  }, [formatDateTime, timerStartedAt])

  const getFormattedNowTime = useCallback(() => {
    return formatDateTime(new Date())
  }, [formatDateTime])

  const startTimer = useCallback((data?: IStartTimerProps) => {
    const startDateNow = data ? data.timerStartedAt : Date.now()

    browseSessionStorage.setItem({
      keyOrigin: 'timer',
      key: 'timerStartedAt',
      payload: startDateNow
    })

    if (data?.timerMarkingData) {
      saveMarkingBkpOnSessionStorage(data.timerMarkingData)
      setTimerMarking(data.timerMarkingData)
    }

    setTimerStartedAt(startDateNow)
    setTimer(data ? data.timer : startDateNow)
    setTimerRunning(true)

    const timerIntervalToSave = setInterval(() => {
      const dateNow = Date.now()

      setTimer(dateNow)

      browseSessionStorage.setItem({
        keyOrigin: 'timer',
        key: 'timer',
        payload: dateNow
      })
    }, 1000)

    setTimerInterval(timerIntervalToSave)
  }, [saveMarkingBkpOnSessionStorage])

  const stopTimer = useCallback(() => {
    clearInterval(timerInterval)
    setTimerRunning(false)

    clearMarkingBkpFromSessionStorage()
  }, [clearMarkingBkpFromSessionStorage, timerInterval])

  const changeStartTime = useCallback((newStartTime: number) => {
    setTimerStartedAt(newStartTime)

    browseSessionStorage.setItem({
      keyOrigin: 'timer',
      key: 'timerStartedAt',
      payload: newStartTime
    })
  }, [])

  useEffect(() => {
    if (browseSessionStorage.getItem({ keyOrigin: 'timer', key: 'timerStartedAt' })) {
      startTimer({
        timerStartedAt: Number(
          browseSessionStorage.getItem({ keyOrigin: 'timer', key: 'timerStartedAt' }) ?? '0'
        ),
        timer: Number(
          browseSessionStorage.getItem({ keyOrigin: 'timer', key: 'timer' }) ?? '0'
        ),
        timerMarkingData: JSON.parse(
          browseSessionStorage.getItem({ keyOrigin: 'timer', key: 'timerMarking' }) ??
          '{ "description": "", "isBillable": false }'
        )
      })
    }
  }, [])

  return (
    <TimerContext.Provider value={{
      timerRunning,
      timerMarking,
      getFormattedTimer,
      getFormattedStartTime,
      getFormattedNowTime,
      startTimer,
      stopTimer,
      changeStartTime,
      updateTimerMarkingData,
      saveMarkingBkpOnSessionStorage
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
