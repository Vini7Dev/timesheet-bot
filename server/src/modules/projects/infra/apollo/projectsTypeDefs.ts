import { gql } from 'apollo-server'

export const projectsTypeDefs = gql`
  type Project {
    id: String!
    code: String!
    name: String!
    customer: Customer!
    created_at: String!
    updated_at: String!
  }
`
