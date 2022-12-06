import React, { useCallback, useEffect, useState } from 'react'
import { FiDollarSign } from 'react-icons/fi'

import { Input } from '../Input'
import { Button } from '../Button'
import { TimerTrackerContainer } from './styles'
import { SelectPopup } from '../SelectPopup'

interface ITimeCountProps {
  timerStartedAt: number
}

export const TimeTracker: React.FC = () => {
  const [projectPopupIsOpen, setProjectPopupIsOpen] = useState(false)

  const [isBillable, setIsBillable] = useState(true)
  const [description, setDescription] = useState('')
  const [timerStartedAt, setTimerStartedAt] = useState<number | null>(null)
  const [timerStopedAt, setTimerStopedAt] = useState<number | null>(null)

  const toggleIsBillable = useCallback(() => {
    setIsBillable(!isBillable)
  }, [isBillable])

  const toggleProjectPopupIsOpen = useCallback(() => {
    setProjectPopupIsOpen(!projectPopupIsOpen)
  }, [projectPopupIsOpen])

  const handleUpdateTimerValue = useCallback(() => {
    const formatPad = (value: number): string => value.toString().padStart(2, '0')

    const formatTimer = (timerStartedAtValue: number): string => {
      const updatedTimerNow = (timerStartedAtValue ?? 0) - Date.now()

      const seconds = Math.floor((updatedTimerNow / 1000) % 60)
      const minutes = Math.floor((updatedTimerNow / 1000 / 60) % 60)
      const hours = Math.floor((updatedTimerNow / (1000 * 60 * 60)) % 24)

      return hours > 0
        ? `${formatPad(hours)}:${formatPad(minutes)}:${formatPad(seconds)}`
        : `${formatPad(minutes)}:${formatPad(seconds)}`
    }

    setInterval(() => formatTimer(timerStartedAt ?? 0))
  }, [timerStartedAt])

  const handleStartTimer = useCallback(() => {
    setTimerStartedAt(Date.now())
    setTimerStopedAt(null)
    handleUpdateTimerValue()
  }, [handleUpdateTimerValue])

  const handleStopTimer = useCallback(() => {
    setTimerStopedAt(Date.now())
    setTimerStartedAt(null)
  }, [])

  return (
    <TimerTrackerContainer>
      <div className="timer-row timer-row-first">
        <Input
          placeholder="Descrição..."
          inputStyle="high"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          id="timer-project-button"
          onClick={toggleProjectPopupIsOpen}
        >
          + Projeto
        </button>

        { projectPopupIsOpen && <SelectPopup popupType="projects" /> }
      </div>

      <div className="timer-row timer-row-second">
        <button id="timer-billable-button" onClick={toggleIsBillable}>
          <FiDollarSign
            color={isBillable ? '#03A9F4' : '#C6D2D9'}
            size={22}
          />
        </button>

        {
          timerStartedAt === null
            ? (
            <Input
              disabled
              placeholder="00:00"
              inputStyle="high"
              value="00:00"
              style={{ textAlign: 'center' }}
            />
              )
            : <TimeCount timerStartedAt={timerStartedAt} />
        }

        <div id="timer-start-stop-button">
          <Button
            buttonStyle={(timerStartedAt !== null) ? 'danger' : 'primary'}
            text={(timerStartedAt !== null) ? 'Parar' : 'Iniciar'}
            onClick={() => (timerStartedAt !== null) ? handleStopTimer() : handleStartTimer()}
          />
        </div>
      </div>
    </TimerTrackerContainer>
  )
}

const TimeCount: React.FC<ITimeCountProps> = ({ timerStartedAt }) => {
  const [timeToShow, setTimeToShow] = useState(timerStartedAt)

  const formatPad = useCallback((value: number): string => {
    return value.toString().padStart(2, '0')
  }, [])

  const formatTimer = useCallback((): string => {
    const updatedTimerNow = timeToShow - (timerStartedAt ?? 0)

    const seconds = Math.floor((updatedTimerNow / 1000) % 60)
    const minutes = Math.floor((updatedTimerNow / (1000 * 60)) % 60)
    const hours = Math.floor((updatedTimerNow / (1000 * 60 * 60)) % 24)

    return hours > 0
      ? `${formatPad(hours)}:${formatPad(minutes)}:${formatPad(seconds)}`
      : `${formatPad(minutes)}:${formatPad(seconds)}`
  }, [formatPad, timeToShow, timerStartedAt])

  useEffect(() => {
    setTimeout(() => setTimeToShow(timeToShow + 1000), 1000)
  }, [formatTimer, timeToShow, timerStartedAt])

  return (
    <Input
      disabled
      placeholder="00:00"
      inputStyle="high"
      value={formatTimer()}
      style={{ textAlign: 'center' }}
    />
  )
}
