import { gql } from '@apollo/client'

export const UPDATE_USER = gql`
  mutation updateUser($data: UpdateUserInput!) {
    updateUser(data: $data) {
      id
      name
      email
      username
    }
  }
`
