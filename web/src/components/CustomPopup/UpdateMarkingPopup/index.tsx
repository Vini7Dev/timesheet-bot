import React, { useCallback, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { FiCheck, FiClock, FiDollarSign, FiLoader, FiUpload, FiX } from 'react-icons/fi'
import * as Yup from 'yup'

import { UPDATE_MARKING } from '../../../graphql/mutations/updateMarking'
import { DELETE_MARKING } from '../../../graphql/mutations/deleteMarking'
import { calculateTotalHoursOfMarking } from '../../../utils/calculateTotalHoursOfMarking'
import { formatTimeNumberToString } from '../../../utils/formatTimeNumberToString'
import { yupFormValidator } from '../../../utils/yupFormValidator'
import { formatDatePad } from '../../../utils/formatPad'
import { useToast } from '../../../hooks/toast'
import { Button } from '../../Button'
import { Input } from '../../Input'
import { SelectPopup } from '../../SelectPopup'
import { UpdateMarkingPopupForm } from './styles'

interface IUpdateMarkingPopupProps {
  disabledEditingMarking: boolean
  marking: IMarkingData
  beforeUpdate: () => void
  beforeDelete: () => void
}

export const UpdateMarkingPopup: React.FC<IUpdateMarkingPopupProps> = ({
  disabledEditingMarking,
  marking: {
    id,
    on_timesheet_status,
    timesheet_error,
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
  const [updateMarkingIsLoading, setUpdateMarkingIsLoading] = useState(false)

  const [dateUpdated, setDateUpdated] = useState(formatDatePad(date))

  const [isBillable, setIsBillable] = useState(work_class === 'PRODUCTION')
  const [descriptionUpdated, setDescriptionUpdated] = useState(description)
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
    const markingData = {
      marking_id: id,
      project_id: projectUpdated.id,
      description: descriptionUpdated,
      date: dateUpdated,
      work_class: isBillable ? 'PRODUCTION' : 'ABSENCE',
      start_time: startTimeUpdated,
      finish_time: finishTimeUpdated,
      start_interval_time: startIntervalTimeUpdated,
      finish_interval_time: finishIntervalTimeUpdated
    }

    const schema = Yup.object().shape({
      marking_id: Yup.string().uuid('UUID invalido da marcação')
        .required('Não foi possível recuperar o ID da marcação!'),
      project_id: Yup.string()
        .uuid('UUID invalido do projeto')
        .required('O projeto é obrigatório!'),
      description: Yup.string()
        .required('A descrição é obrigatória!'),
      date: Yup.string()
        .matches(
          /^\d{4}-\d{2}-\d{2}$/,
          'O formato da data deve ser DD/MM/YYYY'
        ).required('A data é obrigatória!'),
      work_class: Yup.string()
        .required('Deve informar se é billable ou não!'),
      start_time: Yup.string()
        .matches(
          /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
          'O formato do tempo inicial deve ser HH:MM'
        ).required('O horário de inicio é obrigatório!'),
      finish_time: Yup.string()
        .matches(
          /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
          'O formato do tempo final deve ser HH:MM'
        ).required('O horário de finalização é obrigatório!'),
      start_interval_time: Yup.string()
        .matches(
          /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
          'O formato do tempo de intervalo inicial deve ser HH:MM'
        ),
      finish_interval_time: Yup.string()
        .matches(
          /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
          'O formato do tempo de intervalo final deve ser HH:MM'
        )
    })

    const isValid = await yupFormValidator({
      schema,
      data: {
        ...markingData,
        start_interval_time: startIntervalTimeUpdated || '00:00',
        finish_interval_time: finishIntervalTimeUpdated || '00:00'
      },
      addToast: toast.addToast
    })

    if (!isValid) {
      return
    }

    setUpdateMarkingIsLoading(true)

    try {
      await client.mutate({
        mutation: UPDATE_MARKING,
        variables: {
          data: markingData
        }
      })

      toast.addToast({
        type: 'success',
        message: 'Marcação atualizada com sucesso!'
      })

      beforeUpdate()
    } catch (err: any) {
      toast.addToast({
        type: 'error',
        message: err.message
      })
    }

    setUpdateMarkingIsLoading(false)
  }, [beforeUpdate, client, dateUpdated, descriptionUpdated, finishIntervalTimeUpdated, finishTimeUpdated, id, isBillable, projectUpdated.id, startIntervalTimeUpdated, startTimeUpdated, toast.addToast])

  const handleDeleteMarking = useCallback(async () => {
    try {
      const response = confirm('Deseja apagar a marcação? Essa ação não pode ser desfeita!')

      if (!response) {
        return
      }

      await client.mutate<{ deleteMarking: string }>({
        mutation: DELETE_MARKING, variables: { deleteMarkingId: id }
      })

      toast.addToast({
        type: 'success',
        message: 'Marcação removida com sucesso!'
      })

      beforeDelete()
    } catch (err: any) {
      toast.addToast({
        type: 'error',
        message: err.message
      })
    }
  }, [beforeDelete, client, id])

  return (
    <UpdateMarkingPopupForm
      disabledEditingMarking={disabledEditingMarking}
      onTimesheetStatus={on_timesheet_status}
    >
      <h1 id="popup-form-title">Editar Marcação</h1>

      <div className="popup-marking-row popup-marking-first-row">
        <button id="marking-timesheet-status" type="button">
          {
            (() => {
              if (disabledEditingMarking) {
                return (
                  <>
                    <FiUpload color="#F44336" size={20} />
                    Remoção pendente no timesheet
                  </>
                )
              }

              switch (on_timesheet_status) {
                case 'SENT': return (
                  <>
                    <FiCheck color="#4CAF50" size={20} />
                    Enviado ao Multidados
                  </>
                )

                case 'SENDING': return (
                  <>
                    <FiLoader color="#008BEA" size={20} className="sending-icon" />
                    Enviando para o Multidados...
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
                    { `Erro no Multidados! ${timesheet_error ?? 'Tente novamente'}` }
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
          disabled={disabledEditingMarking}
        />

        <Input
          placeholder="Data"
          inputStyle="high"
          type="date"
          defaultValue={dateUpdated}
          onChange={(e) => setDateUpdated(formatDatePad(e.target.value))}
          containerStyle={{ width: 'fit-content' }}
          disabled={disabledEditingMarking}
        />

        <button
          className="marking-project-button"
          disabled={disabledEditingMarking}
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
          disabled={disabledEditingMarking}
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
                width: '3.125rem'
              }}
              value={startTimeUpdated}
              onChange={(e) => setStartTimeUpdated(e.target.value)}
              disabled={disabledEditingMarking}
            />
            <span className="marking-time-inputs-divisor">:</span>
            <Input
              placeholder="11:00"
              inputStyle="high"
              style={{
                textAlign: 'center',
                padding: 0,
                width: '3.125rem'
              }}
              value={finishTimeUpdated}
              onChange={(e) => setFinishTimeUpdated(e.target.value)}
              disabled={disabledEditingMarking}
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
                width: '3.125rem'
              }}
              value={startIntervalTimeUpdated}
              onChange={(e) => setStartIntervalTimeUpdated(e.target.value)}
              disabled={disabledEditingMarking}
            />
            <span className="marking-time-inputs-divisor">:</span>
            <Input
              placeholder="11:00"
              inputStyle="high"
              style={{
                textAlign: 'center',
                padding: 0,
                width: '3.125rem'
              }}
              value={finishIntervalTimeUpdated}
              onChange={(e) => setFinishIntervalTimeUpdated(e.target.value)}
              disabled={disabledEditingMarking}
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
              hideSecondsWhenHoursExist: true,
              forceToShowHours: true
            })
          }
        </div>
      </div>

      <div className="popup-button-margin-top">
        <Button
          text="Atualizar"
          disabled={disabledEditingMarking}
          isLoading={updateMarkingIsLoading}
          onClick={handleUpdateMarking}
        />
      </div>

      <div className="popup-button-margin-top popup-button-small">
        <Button
          text="Apagar"
          disabled={disabledEditingMarking}
          buttonStyle="danger"
          isLoading={false}
          onClick={handleDeleteMarking}
        />
      </div>
    </UpdateMarkingPopupForm>
  )
}
