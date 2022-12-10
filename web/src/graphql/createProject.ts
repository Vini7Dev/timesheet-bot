import { gql } from '@apollo/client'

export const CREATE_PROJECT = gql`
  mutation createProject($data: CreateProjectInput!) {
    createProject(data: $data) {
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
