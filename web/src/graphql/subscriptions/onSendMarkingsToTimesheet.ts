import { gql } from '@apollo/client'

export const ON_SEND_MARKINGS_TO_TIMESHEET = gql`
  subscription onSendMarkingsToTimesheet {
    onSendMarkingsToTimesheet {
      id
      on_timesheet_status
      timesheet_error
    }
  }
`
