import React, { useCallback, useState } from 'react'
import { FiCheck, FiClock, FiDollarSign, FiMoreVertical, FiUpload, FiX } from 'react-icons/fi'

import { Input } from '../../components/Input'
import { TopBar } from '../../components/TopBar'
import { TimeTracker } from '../../components/TimeTracker'
import { SelectPopup } from '../../components/SelectPopup'
import { Navigation } from '../../components/Navigation'
import { MainContent, MarkingItemContainer, PageContainer, PopupContentFormContainer } from './styles'
import { CustomPopup } from '../../components/CustomPopup'
import { Button } from '../../components/Button'

type OnTimesheetStatus = 'SENT' | 'NOT_SENT' | 'ERROR'

type WorkClass = 'PRODUCTION' | 'ABSENCE'

interface IMarkingData {
  id: string
  on_timesheet_status: OnTimesheetStatus
  description: string
  date: string
  start_time: string
  finish_time: string
  start_interval_time: string
  finish_interval_time: string
  work_class: WorkClass
  user_id: string
  project_id: string
  project: {
    name: string
  }
}

interface IMarkingPopupProps {
  marking: IMarkingData
  onClose: () => void
}

interface IMarkingItemProps {
  marking: IMarkingData
  onEdit: (id: string) => void
}

export const Markings: React.FC = () => {
  const [editMarkingIsOpen, setEditMarkingIsOpen] = useState(false)
  const [markingToEdit, setMarkingToEdit] = useState<IMarkingData>({} as unknown as IMarkingData)

  const [markigns, setMarkings] = useState<IMarkingData[]>([
    {
      id: '1',
      on_timesheet_status: 'SENT',
      description: 'Example 1',
      date: '22/01/2023',
      start_time: '10:00',
      finish_time: '15:00',
      start_interval_time: '12:00',
      finish_interval_time: '13:00',
      work_class: 'PRODUCTION',
      user_id: '1',
      project_id: '1',
      project: {
        name: 'Uauness'
      }
    },
    {
      id: '2',
      on_timesheet_status: 'NOT_SENT',
      description: 'Example 2',
      date: '23/01/2023',
      start_time: '09:00',
      finish_time: '14:00',
      start_interval_time: '12:30',
      finish_interval_time: '13:30',
      work_class: 'ABSENCE',
      user_id: '1',
      project_id: '1',
      project: {
        name: 'Uauness'
      }
    },
    {
      id: '3',
      on_timesheet_status: 'ERROR',
      description: 'Example 3',
      date: '23/01/2023',
      start_time: '12:00',
      finish_time: '16:00',
      start_interval_time: '00:00',
      finish_interval_time: '00:00',
      work_class: 'PRODUCTION',
      user_id: '1',
      project_id: '2',
      project: {
        name: 'Mercafé'
      }
    }
  ])

  const toggleEditMarkingIsOpen = useCallback(() => {
    setEditMarkingIsOpen(!editMarkingIsOpen)
  }, [editMarkingIsOpen])

  const handleSetEditMarking = useCallback((id: string) => {
    const markingToEdit = markigns.find(marking => marking.id === id)

    if (markingToEdit) {
      setMarkingToEdit(markingToEdit)

      toggleEditMarkingIsOpen()
    }
  }, [markigns, toggleEditMarkingIsOpen])

  return (
    <PageContainer>
      <TopBar />

      <div id="markings-page-content">
        <Navigation />

        <MainContent>
          <TimeTracker />

          <div id="marking-list-container">
            <strong id="marking-list-title">Marcações</strong>

            <div className="markings-day-group">
              <div className="markings-day-group-header">
                <span className="markings-day-group-date">26/11/2022</span>

                <strong className="markings-day-group-total">8:00</strong>
              </div>

              <div className="marking-day-group-list">
                {
                  markigns.map(marking => (
                    <MarkingItem
                      key={marking.id}
                      marking={marking}
                      onEdit={() => {
                        handleSetEditMarking(marking.id)
                      }}
                    />
                  ))
                }
              </div>
            </div>
          </div>
        </MainContent>
      </div>

      {
        editMarkingIsOpen && (
          <MarkingPopup
            marking={markingToEdit}
            onClose={toggleEditMarkingIsOpen}
          />
        )
      }
    </PageContainer>
  )
}

const MarkingItem: React.FC<IMarkingItemProps> = ({
  marking: {
    id,
    project
  },
  onEdit
}) => {
  const [isBillable, setIsBillable] = useState(false)
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

        <Input placeholder="Descrição..." inputStyle="high" />

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
            />
            :
            <Input
              placeholder="11:00"
              inputStyle="high"
              style={{ textAlign: 'center', width: '4.375rem' }}
            />
          </div>
        </div>

        <span className="marking-row-second-column">
          <div className="marking-time-total">
            <FiClock color="#C6D2D9" size={14} /> 3:00
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
  onClose
}) => {
  const [projectPopupIsOpen, setProjectPopupIsOpen] = useState(false)
  const [isBillable, setIsBillable] = useState(work_class === 'PRODUCTION')

  const toggleProjectPopupIsOpen = useCallback(() => {
    setProjectPopupIsOpen(!projectPopupIsOpen)
  }, [projectPopupIsOpen])

  const toggleIsBillable = useCallback(() => {
    setIsBillable(!isBillable)
  }, [isBillable])

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
            defaultValue={description}
          />

          <Input
            placeholder="Data"
            inputStyle="high"
            defaultValue={date}
            containerStyle={{ width: 'fit-content' }}
          />

          <button
            className="marking-project-button"
            onClick={toggleProjectPopupIsOpen}
            type="button"
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
                defaultValue={start_time}
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
                defaultValue={finish_time}
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
                defaultValue={start_interval_time}
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
                defaultValue={finish_interval_time}
              />
            </div>
          </div>

          <div className="marking-time-total">
            <FiClock color="#C6D2D9" size={14} /> 3:00
          </div>
        </div>

        <div className="popup-button-margin-top">
          <Button
            text="Atualizar"
            isLoading={false}
            onClick={() => {
              //
            }}
          />
        </div>
      </PopupContentFormContainer>
    </CustomPopup>
  )
}
