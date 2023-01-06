import React, { useCallback, useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import * as Yup from 'yup'

import { ON_SEND_MARKINGS_TO_TIMESHEET } from '../../graphql/subscriptions/onSendMarkingsToTimesheet'
import { MARKINGS_BY_USER_ID } from '../../graphql/queries/markingsByUserId'
import { UPDATE_MARKING } from '../../graphql/mutations/updateMarking'
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
import { Button } from '../../components/Button'
import { UpdateMarkingPopup } from '../../components/CustomPopup/UpdateMarkingPopup'
import { SendToTimesheetPopup } from '../../components/CustomPopup/SendToTimesheetPopup'
import { MarkingItem } from './MarkingItem'
import { MainContent, PageContainer } from './styles'

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

export const Markings: React.FC = () => {
  const client = useApolloClient()
  const toast = useToast()

  const [sendToTimesheetIsOpen, setSendToTimesheetIsOpen] = useState(false)
  const [editMarkingIsOpen, setEditMarkingIsOpen] = useState(false)
  const [markingToEdit, setMarkingToEdit] = useState<IMarkingData>({} as unknown as IMarkingData)

  const [loadingMarkings, setLoadingMarkings] = useState(false)

  const [markings, setMarkings] = useState<IMarkingData[]>([])

  const toggleEditMarkingIsOpen = useCallback(() => {
    setEditMarkingIsOpen(!editMarkingIsOpen)
  }, [editMarkingIsOpen])

  const toggleSendToTimesheetIsOpen = useCallback(() => {
    setSendToTimesheetIsOpen(!sendToTimesheetIsOpen)
  }, [sendToTimesheetIsOpen])

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

  useEffect(() => {
    client.subscribe<{
      onSendMarkingsToTimesheet: any[]
    }>({
      query: ON_SEND_MARKINGS_TO_TIMESHEET
    }).subscribe({
      error: (err) => console.error('=======> err', err),
      next: ({ data }) => {
        if (data?.onSendMarkingsToTimesheet) {
          handleGetUserMarkings()
        }
      }
    })
  }, [client, handleGetUserMarkings])

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
                  onClick={toggleSendToTimesheetIsOpen}
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
            <SendToTimesheetPopup
              markings={markings}
              afterSendMarkings={() => {
                handleGetUserMarkings()
                toggleSendToTimesheetIsOpen()
              }}
            />
          </CustomPopup>
        )
      }
    </PageContainer>
  )
}
