import React, { useCallback, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { FiDollarSign } from 'react-icons/fi'
import * as Yup from 'yup'

import { CREATE_MARKING } from '../../graphql/createMarking'
import { yupFormValidator } from '../../utils/yupFormValidator'
import { useToast } from '../../hooks/toast'
import { useTimer } from '../../hooks/timer'
import { Input } from '../Input'
import { Button } from '../Button'
import { SelectPopup } from '../SelectPopup'
import { TimerTrackerContainer } from './styles'

interface ITimeTrackerProps {
  beforeCreateMarking?: () => void
}

export const TimeTracker: React.FC<ITimeTrackerProps> = ({
  beforeCreateMarking = () => null
}) => {
  const client = useApolloClient()
  const toast = useToast()
  const {
    timerRunning,
    getFormattedTimer,
    getFormattedStartTime,
    getFormattedNowTime,
    startTimer,
    stopTimer,
    changeStartTime
  } = useTimer()

  const [projectPopupIsOpen, setProjectPopupIsOpen] = useState(false)
  const [showChangeStartinput, setShowChangeStartinput] = useState(false)
  const [changeStartInputValue, setChangeStartInputValue] = useState('')
  const [createMarkingIsLoading, setCreateMarkingIsLoading] = useState(false)

  const [isBillable, setIsBillable] = useState(true)
  const [description, setDescription] = useState('')
  const [project, setProject] = useState<IProjectProps | undefined>()

  const handleCreateMarking = useCallback(async () => {
    const startTime = getFormattedStartTime()
    const finishTime = getFormattedNowTime()
    const date = new Date()

    const markingData = {
      project_id: project?.id,
      description,
      date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      work_class: isBillable ? 'PRODUCTION' : 'ABSENCE',
      start_time: startTime,
      finish_time: finishTime
    }

    const schema = Yup.object().shape({
      project_id: Yup.string()
        .uuid('UUID invalido do projeto')
        .required('O projeto é obrigatório!'),
      description: Yup.string()
        .min(1, 'A descrição é obrigatória!'),
      date: Yup.string()
        .required('A data é obrigatória!'),
      work_class: Yup.string()
        .required('Deve informar se é billable ou não!'),
      start_time: Yup.string()
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'O formato do tempo inicial deve ser HH:MM')
        .required('O horário de inicio é obrigatório!'),
      finish_time: Yup.string()
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'O formato do tempo final deve ser HH:MM')
        .required('O horário de finalização é obrigatório!')
    })

    const isValid = await yupFormValidator({
      schema,
      data: markingData,
      addToast: toast.addToast
    })

    if (!isValid) {
      return
    }

    try {
      setCreateMarkingIsLoading(true)

      await client.mutate({
        mutation: CREATE_MARKING,
        variables: {
          data: markingData
        }
      })

      setCreateMarkingIsLoading(false)
      beforeCreateMarking()

      return true
    } catch (err: any) {
      toast.addToast({
        type: 'error',
        message: err.message
      })

      setCreateMarkingIsLoading(false)
      return false
    }
  }, [beforeCreateMarking, client, description, getFormattedNowTime, getFormattedStartTime, isBillable, project, toast.addToast])

  const toggleIsBillable = useCallback(() => {
    setIsBillable(!isBillable)
  }, [isBillable])

  const toggleProjectPopupIsOpen = useCallback(() => {
    setProjectPopupIsOpen(!projectPopupIsOpen)
  }, [projectPopupIsOpen])

  const toggleShowChangeStartinput = useCallback(() => {
    if (!showChangeStartinput && timerRunning) {
      setShowChangeStartinput(!showChangeStartinput)
    } else {
      setShowChangeStartinput(false)
    }
  }, [showChangeStartinput, timerRunning])

  const handleStartTimer = useCallback(() => {
    startTimer()
  }, [startTimer])

  const handleStopTimer = useCallback(async () => {
    const markingHasCreated = await handleCreateMarking()

    if (markingHasCreated) {
      setShowChangeStartinput(false)
      stopTimer()
    }
  }, [handleCreateMarking, stopTimer])

  const handleChangeStartTime = useCallback(() => {
    if (!timerRunning || !changeStartInputValue) {
      return
    }

    if (!changeStartInputValue?.includes(':')) {
      alert('Fomato inválido!')

      return
    }

    const [hours, minutes] = changeStartInputValue.split(':')

    if (!hours || !minutes) {
      alert('Fomato inválido!')

      return
    }

    const todayDate = new Date()

    todayDate.setHours(parseInt(hours))
    todayDate.setMinutes(parseInt(minutes))

    changeStartTime(todayDate.getTime())
  }, [changeStartInputValue, changeStartTime, timerRunning])

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
          {
            project
              ? project.name
              : '+ Projeto'
          }
        </button>

        { projectPopupIsOpen && (
          <SelectPopup
            popupType="projects"
            onSelect={(selectedProject) => setProject(selectedProject as IProjectProps)}
          />
        ) }
      </div>

      <div className="timer-row timer-row-second">
        <button id="timer-billable-button" onClick={toggleIsBillable}>
          <FiDollarSign
            color={isBillable ? '#03A9F4' : '#C6D2D9'}
            size={22}
          />
        </button>

        <div id="timer-count-container">
          <Input
            disabled
            placeholder="00:00"
            inputStyle="high"
            value={timerRunning ? getFormattedTimer() : '00:00'}
            style={{ textAlign: 'center' }}
            onClickInContainer={toggleShowChangeStartinput}
          />

          {
            showChangeStartinput && (
              <div id="timer-change-start-input-container">
                <span>HORÁRIO DO INÍCIO</span>

                <div>
                  <Input
                    placeholder={getFormattedStartTime()}
                    inputStyle="high"
                    value={changeStartInputValue}
                    onChange={(e) => setChangeStartInputValue(e.target.value)}
                    onBlur={() => handleChangeStartTime()}
                    style={{ textAlign: 'center' }}
                  />
                </div>
              </div>
            )
          }
        </div>

        <div id="timer-start-stop-button">
          <Button
            isLoading={createMarkingIsLoading}
            buttonStyle={timerRunning ? 'danger' : 'primary'}
            text={timerRunning ? 'Parar' : 'Iniciar'}
            onClick={() => timerRunning ? handleStopTimer() : handleStartTimer()}
          />
        </div>
      </div>
    </TimerTrackerContainer>
  )
}
