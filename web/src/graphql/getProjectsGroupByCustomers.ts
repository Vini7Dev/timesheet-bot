import { gql } from '@apollo/client'

export const PROJECTS_GROUP_BY_CUSTOMERS = gql`
  query getProjectsGroupByCustomers($data: ApiFiltersInput!) {
    customers(data: $data) {
      id
      name
      projects {
        id
        name
        code
      }
    }
  }
`
