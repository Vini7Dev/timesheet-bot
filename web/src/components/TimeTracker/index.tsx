import React, { useCallback, useEffect, useState } from 'react'
import { FiDollarSign } from 'react-icons/fi'

import { Input } from '../Input'
import { Button } from '../Button'
import { ProjectPopupContainer, TimerTrackerContainer } from './styles'

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

    const timerInterval = setInterval(() => formatTimer(timerStartedAt ?? 0))
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
          inputStyle="timer"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          id="timer-project-button"
          onClick={toggleProjectPopupIsOpen}
        >
          + Projeto
        </button>

        { projectPopupIsOpen && <ProjectPopup /> }
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
              inputStyle="timer"
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

const ProjectPopup: React.FC = () => {
  return (
    <ProjectPopupContainer id="timer-project-popup-container">
      <Input placeholder="Pesquise..." />

      <div id="timer-project-popup-results">
        <div id="timer-project-popup-empty-container">
          <p id="timer-project-popup-empty-text">
            Sem resultados...
          </p>
        </div>

        <div className="timer-project-popup-item">
          <strong className="timer-project-popup-customer">ambev</strong>

          <ul className="timer-project-popup-projects">
            <li className="timer-project-popup-project">uauness</li>
          </ul>
        </div>
      </div>

      <Button text="Cadastrar projeto" />
    </ProjectPopupContainer>
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
      inputStyle="timer"
      value={formatTimer()}
      style={{ textAlign: 'center' }}
    />
  )
}
