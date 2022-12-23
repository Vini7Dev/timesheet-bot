import React, { useCallback, useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { FiCheck, FiClock, FiDollarSign, FiMoreVertical, FiUpload, FiX } from 'react-icons/fi'

import { MARKINGS_BY_USER_ID } from '../../graphql/markingsByUserId'
import { formatDateString } from '../../utils/formatDateString'
import { groupMarkingsByDate } from '../../utils/groupMarkingsByDate'
import { orderMarkingsByTime } from '../../utils/orderMarkingsByTime'
import { formatTimeNumberToString } from '../../utils/formatTimeNumberToString'
import { calculateTotalHoursOfMarking } from '../../utils/calculateTotalHoursOfMarking'
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
                          {formatDateString(markingGroup.date)}
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
    work_class
  },
  onEdit
}) => {
  const [isBillable, setIsBillable] = useState(work_class === 'PRODUCTION')
  const [projectPopupIsOpen, setProjectPopupIsOpen] = useState(false)

  const [onTimesheetStatus] = useState<OnTimesheetStatus>('SENT')

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
