import { gql } from '@apollo/client'

export const UPDATE_PROJECT = gql`
  mutation updateProject($data: UpdateProjectInput!) {
    updateProject(data: $data) {
      id
      code
      name
    }
  }
`
