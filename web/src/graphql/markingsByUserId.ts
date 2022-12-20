import { gql } from '@apollo/client'

export const MARKINGS_BY_USER_ID = gql`
  query markingsByUserId($data: ApiFiltersInput!) {
    markingsByUserId(data: $data) {
      id
      description
      date
      start_time
      finish_time
      start_interval_time
      finish_interval_time
      work_class
      project {
        id
        name
      }
    }
  }
`
