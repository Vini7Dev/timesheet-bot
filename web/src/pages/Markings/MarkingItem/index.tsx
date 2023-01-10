import React, { useCallback, useRef, useState } from 'react'
import { FiCheck, FiClock, FiDollarSign, FiLoader, FiMoreVertical, FiUpload, FiX } from 'react-icons/fi'

import { calculateTotalHoursOfMarking } from '../../../utils/calculateTotalHoursOfMarking'
import { formatTimeNumberToString } from '../../../utils/formatTimeNumberToString'
import { useOutsideAlerter } from '../../../hooks/outsideAlerter'
import { Input } from '../../../components/Input'
import { SelectPopup } from '../../../components/SelectPopup'
import { MarkingItemContainer } from './styles'
import { formatDatePad } from '../../../utils/formatPad'

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

interface IOnEditMarkingProps {
  id: string
  disabledMarking: boolean
}

interface IMarkingItemProps {
  marking: IMarkingData
  onEdit: (data: IOnEditMarkingProps) => void
  onUpdate: (data: IUpdateMarkingProps) => Promise<void>
}

export const MarkingItem: React.FC<IMarkingItemProps> = ({
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
    on_timesheet_id,
    on_timesheet_status,
    deleted_at
  },
  onEdit,
  onUpdate
}) => {
  const [editingMarkingTime, setEditingMarkingTime] = useState(false)
  const [projectPopupIsOpen, setProjectPopupIsOpen] = useState(false)

  const [timesheetDeletionIsPending] = useState(!!(deleted_at && on_timesheet_id))
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
      date: formatDatePad(date),
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
    <MarkingItemContainer
      onTimesheetStatus={onTimesheetStatus}
      timesheetDeletionIsPending={timesheetDeletionIsPending}
      ref={wrapperRef}
    >
      <div className="marking-row marking-row-first">
        <button className="marking-timesheet-status">
          {
            (() => {
              switch (onTimesheetStatus) {
                case 'SENT': return <FiCheck color="#4CAF50" size={20} />
                case 'SENDING': return <FiLoader color="#008BEA" size={20} className="sending-icon" />
                case 'NOT_SENT': return <FiUpload color={
                  timesheetDeletionIsPending ? '#F44336' : '#FFC107'
                } size={20} />
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
          disabled={timesheetDeletionIsPending}
        />

        <button
          className="marking-project-button"
          disabled={timesheetDeletionIsPending}
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
            disabled={timesheetDeletionIsPending}
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
              disabled={timesheetDeletionIsPending}
            />
            :
            <Input
              placeholder="11:00"
              inputStyle="high"
              style={{ textAlign: 'center', width: '4.375rem' }}
              value={finishTime}
              onChange={(e) => setFinishTime(e.target.value)}
              onFocus={() => setEditingMarkingTime(true)}
              disabled={timesheetDeletionIsPending}
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
                  date: formatDatePad(date),
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
            <button onClick={() => onEdit({
              id,
              disabledMarking: timesheetDeletionIsPending
            })}>
              <FiMoreVertical color="#C6D2D9" size={14} />
            </button>
          </div>
        </span>
      </div>
    </MarkingItemContainer>
  )
}
