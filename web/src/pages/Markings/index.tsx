import React, { useCallback, useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import * as Yup from 'yup'

import { MARKINGS_BY_USER_ID } from '../../graphql/markingsByUserId'
import { UPDATE_MARKING } from '../../graphql/updateMarking'
import { SEND_MARKINGS_TO_TIMESHEET } from '../../graphql/sendMarkingsToTimesheet'
import { yupFormValidator } from '../../utils/yupFormValidator'
import { formatDateString } from '../../utils/formatDateString'
import { groupMarkingsByDate } from '../../utils/groupMarkingsByDate'
import { orderMarkingsByTime } from '../../utils/orderMarkingsByTime'
import { formatTimeNumberToString } from '../../utils/formatTimeNumberToString'
import { useToast } from '../../hooks/toast'
import { TopBar } from '../../components/TopBar'
import { TimeTracker } from '../../components/TimeTracker'
import { Navigation } from '../../components/Navigation'
import { CustomPopup } from '../../components/CustomPopup'
import { ListAlert } from '../../components/ListAlert'
import { UpdateMarkingPopup } from '../../components/CustomPopup/UpdateMarkingPopup'
import { MainContent, PageContainer, SendToTimesheetPopupContainer } from './styles'
import { Button } from '../../components/Button'
import { MarkingItem } from './MarkingItem'

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

interface IHandleSetMarkingsToTimesheetProps {
  markingId: string
  send: boolean
}

interface IMarkingToSend {
  send: boolean
  marking: IMarkingData
}

export const Markings: React.FC = () => {
  const client = useApolloClient()
  const toast = useToast()

  const [sendToTimesheetIsOpen, setSendToTimesheetIsOpen] = useState(false)
  const [editMarkingIsOpen, setEditMarkingIsOpen] = useState(false)
  const [markingToEdit, setMarkingToEdit] = useState<IMarkingData>({} as unknown as IMarkingData)

  const [loadingMarkings, setLoadingMarkings] = useState(false)

  const [markings, setMarkings] = useState<IMarkingData[]>([])
  const [markingsToTimesheet, setMarkingsToTimesheet] = useState<IMarkingToSend[]>([])

  const toggleEditMarkingIsOpen = useCallback(() => {
    setEditMarkingIsOpen(!editMarkingIsOpen)
  }, [editMarkingIsOpen])

  const toggleSendToTimesheetIsOpen = useCallback(() => {
    setSendToTimesheetIsOpen(!sendToTimesheetIsOpen)
  }, [sendToTimesheetIsOpen])

  const handleOpenSendToTimesheetPopup = useCallback(() => {
    setMarkingsToTimesheet(markings
      .filter(marking => (
        marking.on_timesheet_status !== 'SENT' && marking.on_timesheet_status !== 'SENDING'
      ))
      .map(marking => ({ send: true, marking }))
    )

    toggleSendToTimesheetIsOpen()
  }, [markings, toggleSendToTimesheetIsOpen])

  const handleSetMarkingsToTimesheet = useCallback((
    { markingId, send }: IHandleSetMarkingsToTimesheetProps
  ) => {
    const updatedMarkings = markingsToTimesheet

    const markingToUpdateIndex = updatedMarkings.findIndex(markingToTimesheet =>
      markingToTimesheet.marking.id === markingId
    )

    if (markingToUpdateIndex === -1) {
      return
    }

    updatedMarkings[markingToUpdateIndex].send = send

    setMarkingsToTimesheet(updatedMarkings)
  }, [markingsToTimesheet])

  const handleSendMarkingsToTimesheet = useCallback(async () => {
    const markingsToSend = markingsToTimesheet.filter(marking => marking.send)

    if (markingsToSend.length === 0) {
      toast.addToast({
        type: 'error',
        message: 'Selecione ao menos uma tarefa para atualizar'
      })

      return
    }

    const markingIds = markingsToSend.map(markingToSend => markingToSend.marking.id)

    try {
      await client.mutate({
        mutation: SEND_MARKINGS_TO_TIMESHEET,
        variables: {
          data: { markingIds }
        }
      })

      toast.addToast({
        type: 'success',
        message: 'As marcações estão sendo processadas!'
      })

      toggleSendToTimesheetIsOpen()
    } catch (err: any) {
      toast.addToast({
        type: 'error',
        message: err.message
      })
    }
  }, [client, markingsToTimesheet, toast, toggleSendToTimesheetIsOpen])

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

      toast.addToast({
        type: 'success',
        message: 'Marcação atualizada com sucesso!'
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
            <div id="marking-list-head">
              <strong id="marking-list-title">Marcações</strong>

              <div id="send-timesheet-button">
                <Button
                  text="Atualizar no Multidados"
                  onClick={handleOpenSendToTimesheetPopup}
                  buttonStyle="pending"
                />
              </div>
            </div>

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

      {
        sendToTimesheetIsOpen && (
          <CustomPopup onClickToClose={toggleSendToTimesheetIsOpen}>
            <SendToTimesheetPopupContainer>
              <h1 id="popup-form-title">Atualizar no Multidados</h1>
              <p id="popup-form-subtitle">Selecione as marcações que serão enviadas</p>

              <div id="popup-list-container">
                {markingsToTimesheet.map(({
                  send,
                  marking
                }) => (
                  <label
                    className="popup-marking-container"
                    key={marking.id}
                  >
                    <input
                      type="checkbox"
                      defaultChecked={send}
                      onChange={(e) => handleSetMarkingsToTimesheet({
                        markingId: marking.id,
                        send: e.target.checked
                      })}
                    />

                    <div className="popup-marking-data">
                      <p>{marking.description}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="popup-button-margin-top">
                <Button
                  text="Atualizar"
                  isLoading={false}
                  onClick={handleSendMarkingsToTimesheet}
                />
              </div>
            </SendToTimesheetPopupContainer>
          </CustomPopup>
        )
      }
    </PageContainer>
  )
}
