import { gql } from '@apollo/client'

export const CREATE_MARKING = gql`
  mutation createMarking($data: CreateMarkingInput!) {
    createMarking(data: $data) {
      id
    }
  }
`
