import { gql } from '@apollo/client'

export const CUSTOMERS = gql`
  query customers($data: ApiFiltersInput!){
    customers(data: $data) {
      id
      code
      name
    }
  }
`
