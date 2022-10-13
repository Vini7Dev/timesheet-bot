import { gql } from 'apollo-server'

export const projectsTypeDefs = gql`
  extend type Mutation {
    createProject(data: CreateProjectInput!): Project!
  }

  type Project {
    id: String!
    code: String!
    name: String!
    customer: Customer!
    created_at: String!
    updated_at: String!
  }

  input CreateProjectInput {
    code: String!
    name: String!
    customer_id: String!
  }
`
