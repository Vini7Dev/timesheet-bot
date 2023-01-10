import { gql } from '@apollo/client'

export const MARKINGS_BY_USER_ID = gql`
  query markingsByUserId($data: ApiFiltersInput!) {
    markingsByUserId(data: $data) {
      id
      on_timesheet_id
      on_timesheet_status
      timesheet_error
      description
      date
      start_time
      finish_time
      start_interval_time
      finish_interval_time
      work_class
      deleted_at
      project {
        id
        name
      }
    }
  }
`
