import React, { useCallback, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { FiCheck, FiClock, FiDollarSign, FiUpload, FiX } from 'react-icons/fi'

import { UPDATE_MARKING } from '../../../graphql/updateMarking'
import { calculateTotalHoursOfMarking } from '../../../utils/calculateTotalHoursOfMarking'
import { formatTimeNumberToString } from '../../../utils/formatTimeNumberToString'
import { useToast } from '../../../hooks/toast'
import { Button } from '../../Button'
import { Input } from '../../Input'
import { SelectPopup } from '../../SelectPopup'
import { UpdateMarkingPopupForm } from './styles'

interface IUpdateMarkingPopupProps {
  marking: IMarkingData
  beforeUpdate: () => void
  beforeDelete: () => void
}

export const UpdateMarkingPopup: React.FC<IUpdateMarkingPopupProps> = ({
  marking: {
    id,
    on_timesheet_status,
    description,
    date,
    start_time,
    finish_time,
    start_interval_time,
    finish_interval_time,
    work_class,
    project
  },
  beforeUpdate,
  beforeDelete
}) => {
  const client = useApolloClient()
  const toast = useToast()

  const [projectPopupIsOpen, setProjectPopupIsOpen] = useState(false)

  const [isBillable, setIsBillable] = useState(work_class === 'PRODUCTION')
  const [descriptionUpdated, setDescriptionUpdated] = useState(description)
  const [dateUpdated, setDateUpdated] = useState(date)
  const [startTimeUpdated, setStartTimeUpdated] = useState(start_time)
  const [finishTimeUpdated, setFinishTimeUpdated] = useState(finish_time)
  const [startIntervalTimeUpdated, setStartIntervalTimeUpdated] = useState(start_interval_time)
  const [finishIntervalTimeUpdated, setFinishIntervalTimeUpdated] = useState(finish_interval_time)
  const [projectUpdated, setProjectUpdated] = useState(project)

  const toggleProjectPopupIsOpen = useCallback(() => {
    setProjectPopupIsOpen(!projectPopupIsOpen)
  }, [projectPopupIsOpen])

  const toggleIsBillable = useCallback(() => {
    setIsBillable(!isBillable)
  }, [isBillable])

  const handleUpdateMarking = useCallback(async () => {
    const {
      errors
    } = await client.mutate({
      mutation: UPDATE_MARKING,
      variables: {
        data: {
          marking_id: id,
          project_id: projectUpdated.id,
          date: dateUpdated,
          description: descriptionUpdated,
          work_class: isBillable ? 'PRODUCTION' : 'ABSENCE',
          start_time: startTimeUpdated,
          finish_time: finishTimeUpdated,
          start_interval_time: startIntervalTimeUpdated,
          finish_interval_time: finishIntervalTimeUpdated
        }
      }
    })

    if (errors && errors.length > 0) {
      for (const error of errors) {
        toast.addToast({
          type: 'error',
          message: error.message
        })
      }
    }

    beforeUpdate()
  }, [beforeUpdate, client, dateUpdated, descriptionUpdated, finishIntervalTimeUpdated, finishTimeUpdated, id, isBillable, projectUpdated.id, startIntervalTimeUpdated, startTimeUpdated, toast])

  const handleDeleteMarking = useCallback(async () => {
    beforeDelete()
  }, [beforeDelete])

  return (
    <UpdateMarkingPopupForm onTimesheetStatus={on_timesheet_status}>
      <h1 id="popup-form-title">Editar Marcação</h1>

      <div className="popup-marking-row popup-marking-first-row">
        <button id="marking-timesheet-status" type="button">
          {
            (() => {
              switch (on_timesheet_status) {
                case 'SENT': return (
                  <>
                    <FiCheck color="#4CAF50" size={20} />
                    Enviado ao Multidados
                  </>
                )

                case 'NOT_SENT': return (
                  <>
                    <FiUpload color="#FFC107" size={20} />
                    Enviar para o Multidados
                  </>
                )
                case 'ERROR': return (
                  <>
                    <FiX color="#F44336" size={20} />
                    Erro no Multidados! Tente novamente
                  </>
                )
                default: return (
                  <>
                    <FiX color="#F44336" size={20} />
                    Erro desconhecido! Tente novamente
                  </>
                )
              }
            })()
          }
        </button>
      </div>

      <div className="popup-marking-row popup-marking-second-row">
        <Input
          placeholder="Descrição..."
          inputStyle="high"
          value={descriptionUpdated}
          onChange={(e) => setDescriptionUpdated(e.target.value)}
        />

        <Input
          placeholder="Data"
          inputStyle="high"
          defaultValue={dateUpdated}
          onChange={(e) => setDateUpdated(e.target.value)}
          containerStyle={{ width: 'fit-content' }}
        />

        <button
          className="marking-project-button"
          onClick={toggleProjectPopupIsOpen}
          type="button"
        >
          {projectUpdated.name}
        </button>

        { projectPopupIsOpen && (
          <SelectPopup
            popupType="projects"
            onSelect={(project) => {
              setProjectUpdated(project)
              toggleProjectPopupIsOpen()
            }}
          />
        ) }
      </div>

      <div className="popup-marking-row popup-marking-third-row">
        <button
          className="marking-billable-button"
          onClick={toggleIsBillable}
          type="button"
        >
          <FiDollarSign
            color={isBillable ? '#03A9F4' : '#C6D2D9'}
            size={22}
          />
        </button>

        <div className="marking-times-container marking-times-start-end">
          <span className="marking-times-text">Tempo gasto</span>

          <div className="marking-time-inputs">
            <Input
              placeholder="10:00"
              inputStyle="high"
              style={{
                textAlign: 'center',
                padding: 0,
                width: '50px'
              }}
              value={startTimeUpdated}
              onChange={(e) => setStartTimeUpdated(e.target.value)}
            />
            <span className="marking-time-inputs-divisor">:</span>
            <Input
              placeholder="11:00"
              inputStyle="high"
              style={{
                textAlign: 'center',
                padding: 0,
                width: '50px'
              }}
              value={finishTimeUpdated}
              onChange={(e) => setFinishTimeUpdated(e.target.value)}
            />
          </div>
        </div>

        <div className="marking-times-container marking-times-interval">
          <span className="marking-times-text">Tempo de pausa</span>

          <div className="marking-time-inputs">
            <Input
              placeholder="10:00"
              inputStyle="high"
              style={{
                textAlign: 'center',
                padding: 0,
                width: '50px'
              }}
              value={startIntervalTimeUpdated}
              onChange={(e) => setStartIntervalTimeUpdated(e.target.value)}
            />
            <span className="marking-time-inputs-divisor">:</span>
            <Input
              placeholder="11:00"
              inputStyle="high"
              style={{
                textAlign: 'center',
                padding: 0,
                width: '50px'
              }}
              value={finishIntervalTimeUpdated}
              onChange={(e) => setFinishIntervalTimeUpdated(e.target.value)}
            />
          </div>
        </div>

        <div className="marking-time-total">
          <FiClock color="#C6D2D9" size={14} />{' '}
          {
            formatTimeNumberToString({
              timeStartedAt: 0,
              currentTime: calculateTotalHoursOfMarking({
                date,
                startTime: startTimeUpdated,
                finishTime: finishTimeUpdated,
                startIntervalTime: startIntervalTimeUpdated,
                finishIntervalTime: finishIntervalTimeUpdated
              }),
              hideSecondsWhenHoursExist: true
            })
          }
        </div>
      </div>

      <div className="popup-button-margin-top">
        <Button
          text="Atualizar"
          isLoading={false}
          onClick={handleUpdateMarking}
        />
      </div>

      <div className="popup-button-margin-top popup-button-small">
        <Button
          text="Apagar"
          buttonStyle="danger"
          isLoading={false}
          onClick={handleDeleteMarking}
        />
      </div>
    </UpdateMarkingPopupForm>
  )
}
