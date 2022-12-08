import { gql } from '@apollo/client'

export const CREATE_CUSTOMER = gql`
  mutation createCustomer($data: CreateCustomerInput!) {
    createCustomer(data: $data) {
      id
      code
      name
    }
  }
`
