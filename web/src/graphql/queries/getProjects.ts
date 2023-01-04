import { gql } from '@apollo/client'

export const PROJECTS = gql`
  query getProjects($data: ApiFiltersInput!){
    projects(data: $data) {
      id
      code
      name
      customer {
        id
        name
      }
    }
  }
`
