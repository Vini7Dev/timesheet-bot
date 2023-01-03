import { gql } from '@apollo/client'

export const SEND_MARKINGS_TO_TIMESHEET = gql`
  mutation sendMarkingsToTimesheet($data: SendMarkingsToTimesheetInput) {
    sendMarkingsToTimesheet(
      data: $data
    ) {
      markings {
        id
        data {
          id
        }
        error {
          code
          message
        }
      }
    }
  }
`
