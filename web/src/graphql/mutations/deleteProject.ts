import { gql } from '@apollo/client'

export const DELETE_PROJECT = gql`
  mutation deleteProject($deleteProjectId: ID!) {
    deleteProject(id: $deleteProjectId)
  }
`
