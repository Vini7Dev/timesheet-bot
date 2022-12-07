import React, { useCallback, useState } from 'react'
import { FiDollarSign } from 'react-icons/fi'

import { Input } from '../Input'
import { Button } from '../Button'
import { TimerTrackerContainer } from './styles'
import { SelectPopup } from '../SelectPopup'
import { useTimer } from '../../hooks/timer'

export const TimeTracker: React.FC = () => {
  const {
    timerRunning,
    getTimerFormated,
    startTimer,
    stopTimer
  } = useTimer()

  const [projectPopupIsOpen, setProjectPopupIsOpen] = useState(false)
  const [isBillable, setIsBillable] = useState(true)
  const [description, setDescription] = useState('')

  const toggleIsBillable = useCallback(() => {
    setIsBillable(!isBillable)
  }, [isBillable])

  const toggleProjectPopupIsOpen = useCallback(() => {
    setProjectPopupIsOpen(!projectPopupIsOpen)
  }, [projectPopupIsOpen])

  const handleStartTimer = useCallback(() => {
    startTimer()
  }, [startTimer])

  const handleStopTimer = useCallback(() => {
    stopTimer()
  }, [stopTimer])

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

        <Input
          disabled
          placeholder="00:00"
          inputStyle="high"
          value={timerRunning ? getTimerFormated() : '00:00'}
          style={{ textAlign: 'center' }}
        />

        <div id="timer-start-stop-button">
          <Button
            buttonStyle={timerRunning ? 'danger' : 'primary'}
            text={timerRunning ? 'Parar' : 'Iniciar'}
            onClick={() => timerRunning ? handleStopTimer() : handleStartTimer()}
          />
        </div>
      </div>
    </TimerTrackerContainer>
  )
}
