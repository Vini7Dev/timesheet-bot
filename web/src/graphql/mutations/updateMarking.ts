import { gql } from '@apollo/client'

export const UPDATE_MARKING = gql`
  mutation updateMarking($data: UpdateMarkingInput!) {
    updateMarking(data: $data) {
      id
    }
  }
`
