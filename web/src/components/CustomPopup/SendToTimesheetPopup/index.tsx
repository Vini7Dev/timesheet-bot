import { useApolloClient } from '@apollo/client'
import React, { useCallback, useEffect, useState } from 'react'

import { SEND_MARKINGS_TO_TIMESHEET } from '../../../graphql/mutations/sendMarkingsToTimesheet'
import { useToast } from '../../../hooks/toast'
import { Button } from '../../Button'

import { SendToTimesheetPopupContainer } from './styles'

interface ISendToTimesheetPopupProps {
  markings: IMarkingData[]
  afterSendMarkings: () => void
}

interface IHandleSetMarkingsToTimesheetProps {
  markingId: string
  send: boolean
}

interface IMarkingToSend {
  send: boolean
  marking: IMarkingData
}

export const SendToTimesheetPopup: React.FC<ISendToTimesheetPopupProps> = ({
  markings,
  afterSendMarkings
}) => {
  const toast = useToast()
  const client = useApolloClient()

  const [markingsToTimesheetIsLoading, setMarkingsToTimesheetIsLoading] = useState(false)
  const [markingsToTimesheet, setMarkingsToTimesheet] = useState<IMarkingToSend[]>([])

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

    setMarkingsToTimesheetIsLoading(true)

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

      afterSendMarkings()
    } catch (err: any) {
      toast.addToast({
        type: 'error',
        message: err.message
      })
    }

    setMarkingsToTimesheetIsLoading(false)
  }, [afterSendMarkings, client, markingsToTimesheet, toast])

  useEffect(() => {
    setMarkingsToTimesheet(markings
      .filter(marking => (
        marking.on_timesheet_status !== 'SENT' && marking.on_timesheet_status !== 'SENDING'
      ))
      .map(marking => ({ send: true, marking }))
    )
  }, [markings])

  return (
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
          isLoading={markingsToTimesheetIsLoading}
          onClick={handleSendMarkingsToTimesheet}
        />
      </div>
    </SendToTimesheetPopupContainer>
  )
}
