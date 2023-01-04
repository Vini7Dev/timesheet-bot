import { gql } from '@apollo/client'

export const DELETE_MARKING = gql`
  mutation deleteMarking($deleteMarkingId: ID!) {
    deleteMarking(id: $deleteMarkingId)
  }
`
