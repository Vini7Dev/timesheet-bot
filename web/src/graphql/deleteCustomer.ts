import { gql } from '@apollo/client'

export const DELETE_CUSTOMER = gql`
  mutation deleteCustomer($deleteCustomerId: ID!) {
    deleteCustomer(id: $deleteCustomerId)
  }
`
