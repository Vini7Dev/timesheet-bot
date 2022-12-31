import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { FiCheck, FiClock, FiDollarSign, FiMoreVertical, FiUpload, FiX } from 'react-icons/fi'
import * as Yup from 'yup'

import { MARKINGS_BY_USER_ID } from '../../graphql/markingsByUserId'
import { UPDATE_MARKING } from '../../graphql/updateMarking'
import { yupFormValidator } from '../../utils/yupFormValidator'
import { formatDateString } from '../../utils/formatDateString'
import { groupMarkingsByDate } from '../../utils/groupMarkingsByDate'
import { orderMarkingsByTime } from '../../utils/orderMarkingsByTime'
import { formatTimeNumberToString } from '../../utils/formatTimeNumberToString'
import { calculateTotalHoursOfMarking } from '../../utils/calculateTotalHoursOfMarking'
import { useOutsideAlerter } from '../../hooks/outsideAlerter'
import { useToast } from '../../hooks/toast'
import { Input } from '../../components/Input'
import { TopBar } from '../../components/TopBar'
import { TimeTracker } from '../../components/TimeTracker'
import { SelectPopup } from '../../components/SelectPopup'
import { Navigation } from '../../components/Navigation'
import { CustomPopup } from '../../components/CustomPopup'
import { ListAlert } from '../../components/ListAlert'
import { UpdateMarkingPopup } from '../../components/CustomPopup/UpdateMarkingPopup'
import { MainContent, MarkingItemContainer, PageContainer } from './styles'

interface IGetUserMarkingsResponse {
  markingsByUserId: IMarkingData[]
}

interface IUpdateMarkingProps {
  date: string
  marking_id: string
  project_id?: string
  description?: string
  start_time?: string
  finish_time?: string
  work_class?: WorkClass
}

interface IHandleUpdateMarkingProps {
  newProjectId?: string
  newDescription?: string
  newStartTime?: string
  newFinishTime?: string
  newWorkClass?: WorkClass
}

interface IMarkingItemProps {
  marking: IMarkingData
  onEdit: (id: string) => void
  onUpdate: (data: IUpdateMarkingProps) => Promise<void>
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

    try {
      const { data: markingsResponse } = await client.query<IGetUserMarkingsResponse>({
        query: MARKINGS_BY_USER_ID,
        variables: {
          data: {}
        },
        fetchPolicy: 'no-cache'
      })

      setMarkings(markingsResponse.markingsByUserId)
    } catch (err: any) {
      toast.addToast({
        type: 'error',
        message: err.message
      })
    }

    setLoadingMarkings(false)
  }, [client])

  const handleUpdateMarking = useCallback(async ({
    date,
    marking_id,
    project_id,
    description,
    start_time,
    finish_time,
    work_class
  }: IUpdateMarkingProps) => {
    const markingData = {
      marking_id,
      project_id,
      date,
      description,
      start_time,
      finish_time,
      work_class
    }

    const schema = Yup.object().shape({
      marking_id: Yup.string().uuid('UUID invalido da marcação').required('Não foi possível recuperar o ID da marcação!'),
      project_id: Yup.string().uuid('UUID invalido do projeto'),
      description: Yup.string().min(1, 'A descrição não pode estar vazia!'),
      date: Yup.string().matches(
        /^\d{4}-\d{2}-\d{2}$/,
        'O formato da data deve ser DD/MM/YYYY'
      ),
      work_class: Yup.string(),
      start_time: Yup.string().matches(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        'O formato do tempo inicial deve ser HH:MM'
      ),
      finish_time: Yup.string().matches(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        'O formato do tempo final deve ser HH:MM'
      )
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
      await client.mutate({
        mutation: UPDATE_MARKING,
        variables: {
          data: markingData
        }
      })
      handleGetUserMarkings()
    } catch (err: any) {
      toast.addToast({
        type: 'error',
        message: err.message
      })
    }
  }, [client, handleGetUserMarkings])

  useEffect(() => {
    handleGetUserMarkings()
  }, [handleGetUserMarkings])

  return (
    <PageContainer>
      <TopBar />

      <div id="markings-page-content">
        <Navigation />

        <MainContent>
          <TimeTracker beforeCreateMarking={handleGetUserMarkings} />

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
                          {formatDateString(markingGroup.date)}
                        </span>

                        <strong className="markings-day-group-total">
                          {formatTimeNumberToString({
                            timeStartedAt: 0,
                            currentTime: markingGroup.totalHours,
                            hideSecondsWhenHoursExist: true,
                            forceToShowHours: true
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
                                onUpdate={handleUpdateMarking}
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
          <CustomPopup onClickToClose={toggleEditMarkingIsOpen}>
            <UpdateMarkingPopup
              marking={markingToEdit}
              beforeUpdate={() => {
                toggleEditMarkingIsOpen()
                handleGetUserMarkings()
              }}
              beforeDelete={() => {
                toggleEditMarkingIsOpen()
                handleGetUserMarkings()
              }}
            />
          </CustomPopup>
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
    work_class,
    on_timesheet_status
  },
  onEdit,
  onUpdate
}) => {
  const [editingMarkingTime, setEditingMarkingTime] = useState(false)
  const [projectPopupIsOpen, setProjectPopupIsOpen] = useState(false)

  const [isBillable, setIsBillable] = useState(work_class === 'PRODUCTION')
  const [onTimesheetStatus] = useState<OnTimesheetStatus>(on_timesheet_status)
  const [startTime, setStarTime] = useState(start_time)
  const [finishTime, setFinishTime] = useState(finish_time)

  const wrapperRef = useRef(null)
  useOutsideAlerter({
    ref: editingMarkingTime ? wrapperRef : {},
    callback: () => {
      setEditingMarkingTime(false)

      handleUpdateMarking({
        newStartTime: startTime,
        newFinishTime: finishTime
      })
    }
  })

  const toggleProjectPopupIsOpen = useCallback(() => {
    setProjectPopupIsOpen(!projectPopupIsOpen)
  }, [projectPopupIsOpen])

  const handleUpdateMarking = useCallback(({
    newProjectId,
    newDescription,
    newStartTime,
    newFinishTime,
    newWorkClass
  }: IHandleUpdateMarkingProps) => {
    onUpdate({
      date,
      marking_id: id,
      project_id: newProjectId,
      description: newDescription,
      start_time: newStartTime,
      finish_time: newFinishTime,
      work_class: newWorkClass
    })
  }, [date, id, onUpdate])

  const toggleIsBillable = useCallback(() => {
    setIsBillable(!isBillable)
    handleUpdateMarking({ newWorkClass: isBillable ? 'ABSENCE' : 'PRODUCTION' })
  }, [handleUpdateMarking, isBillable])

  return (
    <MarkingItemContainer onTimesheetStatus={onTimesheetStatus} ref={wrapperRef}>
      <div className="marking-row marking-row-first">
        <button className="marking-timesheet-status">
          {
            (() => {
              switch (onTimesheetStatus) {
                case 'SENT': return <FiCheck color="#4CAF50" size={20} />
                case 'SENDING': return <FiCheck color="#008BEA" size={20} />
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
          onBlur={(e) => handleUpdateMarking({ newDescription: e.target.value })}
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
            onSelect={(selectedProject) => {
              handleUpdateMarking({ newProjectId: selectedProject.id })
              toggleProjectPopupIsOpen()
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
              value={startTime}
              onChange={(e) => setStarTime(e.target.value)}
              onFocus={() => setEditingMarkingTime(true)}
            />
            :
            <Input
              placeholder="11:00"
              inputStyle="high"
              style={{ textAlign: 'center', width: '4.375rem' }}
              value={finishTime}
              onChange={(e) => setFinishTime(e.target.value)}
              onFocus={() => setEditingMarkingTime(true)}
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
                hideSecondsWhenHoursExist: true,
                forceToShowHours: true
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
