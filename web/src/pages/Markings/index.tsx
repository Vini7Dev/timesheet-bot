import React, { useCallback, useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { FiCheck, FiClock, FiDollarSign, FiMoreVertical, FiUpload, FiX } from 'react-icons/fi'

import { MARKINGS_BY_USER_ID } from '../../graphql/markingsByUserId'
import { UPDATE_MARKING } from '../../graphql/updateMarking'
import { groupMarkingsByDate } from '../../utils/groupMarkingsByDate'
import { orderMarkingsByTime } from '../../utils/orderMarkingsByTime'
import { formatTimeNumberToString } from '../../utils/formatTimeNumberToString'
import { calculateTotalHoursOfMarking } from '../../utils/calculateTotalHoursOfMarking'
import { useToast } from '../../hooks/toast'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import { TopBar } from '../../components/TopBar'
import { TimeTracker } from '../../components/TimeTracker'
import { SelectPopup } from '../../components/SelectPopup'
import { Navigation } from '../../components/Navigation'
import { CustomPopup } from '../../components/CustomPopup'
import { ListAlert } from '../../components/ListAlert'
import { MainContent, MarkingItemContainer, PageContainer, PopupContentFormContainer } from './styles'

interface IGetUserMarkingsResponse {
  markingsByUserId: IMarkingData[]
}

interface IMarkingPopupProps {
  marking: IMarkingData
  onClose: () => void
  beforeUpdate: () => void
  beforeDelete: () => void
}

interface IMarkingItemProps {
  marking: IMarkingData
  onEdit: (id: string) => void
}

export const Markings: React.FC = () => {
  const client = useApolloClient()
  const toast = useToast()

  const [editMarkingIsOpen, setEditMarkingIsOpen] = useState(false)
  const [markingToEdit, setMarkingToEdit] = useState<IMarkingData>({} as unknown as IMarkingData)

  const [loadingMarkings, setLoadingMarkings] = useState(false)

  const [markings, setMarkings] = useState<IMarkingData[]>([])

  const toggleEditMarkingIsOpen = useCallback(() => {
    setEditMarkingIsOpen(!editMarkingIsOpen)
  }, [editMarkingIsOpen])

  const handleSetEditMarking = useCallback((id: string) => {
    const markingToEdit = markings.find(marking => marking.id === id)

    if (markingToEdit) {
      setMarkingToEdit(markingToEdit)

      toggleEditMarkingIsOpen()
    }
  }, [markings, toggleEditMarkingIsOpen])

  const handleGetUserMarkings = useCallback(async () => {
    setLoadingMarkings(true)

    const { data: markingsResponse, errors } = await client.query<IGetUserMarkingsResponse>({
      query: MARKINGS_BY_USER_ID,
      variables: {
        data: {}
      },
      fetchPolicy: 'no-cache'
    })

    if (errors && errors.length > 0) {
      for (const error of errors) {
        toast.addToast({
          type: 'error',
          message: error.message
        })
      }
    } else {
      setMarkings(markingsResponse.markingsByUserId)
    }

    setLoadingMarkings(false)
  }, [client, toast])

  useEffect(() => {
    handleGetUserMarkings()
  }, [handleGetUserMarkings])

  return (
    <PageContainer>
      <TopBar />

      <div id="markings-page-content">
        <Navigation />

        <MainContent>
          <TimeTracker />

          <div id="marking-list-container">
            <strong id="marking-list-title">Marcações</strong>

            {
              loadingMarkings
                ? <ListAlert alertType={'loading'} />
                : markings.length > 0
                  ? groupMarkingsByDate(markings).map((markingGroup) => (
                    <div className="markings-day-group" key={markingGroup.date}>
                      <div className="markings-day-group-header">
                        <span className="markings-day-group-date">
                          {markingGroup.date}
                        </span>

                        <strong className="markings-day-group-total">
                          {formatTimeNumberToString({
                            timeStartedAt: 0,
                            currentTime: markingGroup.totalHours,
                            hideSecondsWhenHoursExist: true
                          })}
                        </strong>
                      </div>

                      <div className="marking-day-group-list">
                        {
                          markingGroup.markings.length > 0
                            ? orderMarkingsByTime(markingGroup.markings).map(marking => (
                              <MarkingItem
                                key={marking.id}
                                marking={marking}
                                onEdit={() => {
                                  handleSetEditMarking(marking.id)
                                }}
                              />
                            ))
                            : (<ListAlert alertType={'empty'} />)
                        }
                      </div>
                    </div>
                  ))
                  : (<ListAlert alertType={'empty'} />)
            }
          </div>
        </MainContent>
      </div>

      {
        editMarkingIsOpen && (
          <MarkingPopup
            marking={markingToEdit}
            onClose={toggleEditMarkingIsOpen}
            beforeUpdate={() => {
              toggleEditMarkingIsOpen()
              handleGetUserMarkings()
            }}
            beforeDelete={() => {
              toggleEditMarkingIsOpen()
              handleGetUserMarkings()
            }}
          />
        )
      }
    </PageContainer>
  )
}

const MarkingItem: React.FC<IMarkingItemProps> = ({
  marking: {
    id,
    project,
    description,
    date,
    start_time,
    finish_time,
    start_interval_time,
    finish_interval_time,
    work_class
  },
  onEdit
}) => {
  const [isBillable, setIsBillable] = useState(work_class === 'PRODUCTION')
  const [projectPopupIsOpen, setProjectPopupIsOpen] = useState(false)

  const [onTimesheetStatus, setOnTimesheetStatus] = useState<OnTimesheetStatus>('SENT')

  const toggleIsBillable = useCallback(() => {
    setIsBillable(!isBillable)
  }, [isBillable])

  const toggleProjectPopupIsOpen = useCallback(() => {
    setProjectPopupIsOpen(!projectPopupIsOpen)
  }, [projectPopupIsOpen])

  return (
    <MarkingItemContainer onTimesheetStatus={onTimesheetStatus}>
      <div className="marking-row marking-row-first">
        <button className="marking-timesheet-status">
          {
            (() => {
              switch (onTimesheetStatus) {
                case 'SENT': return <FiCheck color="#4CAF50" size={20} />
                case 'NOT_SENT': return <FiUpload color="#FFC107" size={20} />
                case 'ERROR': return <FiX color="#F44336" size={20} />
                default: return <FiX color="#F44336" size={20} />
              }
            })()
          }
        </button>

        <Input
          placeholder="Descrição..."
          inputStyle="high"
          defaultValue={description}
        />

        <button
          className="marking-project-button"
          onClick={toggleProjectPopupIsOpen}
        >
          {project.name}
        </button>

        { projectPopupIsOpen && (
          <SelectPopup
            popupType="projects"
            onSelect={() => {
              //
            }}
          />
        ) }
      </div>

      <div className="marking-row marking-row-second">
        <div className="marking-row-first-column ">
          <button
            className="marking-billable-button"
            onClick={toggleIsBillable}
          >
            <FiDollarSign
              color={isBillable ? '#03A9F4' : '#C6D2D9'}
              size={22}
            />
          </button>

          <div className="marking-time-inputs">
            <Input
              placeholder="10:00"
              inputStyle="high"
              style={{ textAlign: 'center', width: '4.375rem' }}
              defaultValue={start_time}
            />
            :
            <Input
              placeholder="11:00"
              inputStyle="high"
              style={{ textAlign: 'center', width: '4.375rem' }}
              defaultValue={finish_time}
            />
          </div>
        </div>

        <span className="marking-row-second-column">
          <div className="marking-time-total">
            <FiClock color="#C6D2D9" size={14} />{' '}
            {
              formatTimeNumberToString({
                timeStartedAt: 0,
                currentTime: calculateTotalHoursOfMarking({
                  date,
                  startTime: start_time,
                  finishTime: finish_time,
                  startIntervalTime: start_interval_time,
                  finishIntervalTime: finish_interval_time
                }),
                hideSecondsWhenHoursExist: true
              })
            }
          </div>

          <div className="marking-more-options">
            <button onClick={() => onEdit(id)}>
              <FiMoreVertical color="#C6D2D9" size={14} />
            </button>
          </div>
        </span>
      </div>
    </MarkingItemContainer>
  )
}

export const MarkingPopup: React.FC<IMarkingPopupProps> = ({
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
  onClose,
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
    <CustomPopup onClickToClose={onClose}>
      <PopupContentFormContainer onTimesheetStatus={on_timesheet_status}>
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
      </PopupContentFormContainer>
    </CustomPopup>
  )
}
