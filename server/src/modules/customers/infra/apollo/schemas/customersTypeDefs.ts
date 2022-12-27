import { gql } from 'apollo-server'

export const customersTypeDefs = gql`
  extend type Query {
    customer(id: ID!): Customer!
    customers(data: ApiFiltersInput!): [Customer!]!
  }

  extend type Mutation {
    createCustomer(data: CreateCustomerInput!): Customer!
    updateCustomer(data: UpdateCustomerInput!): Customer!
    deleteCustomer(id: ID!): ID!
  }

  type Customer {
    id: ID!
    code: String!
    name: String!
    projects: [Project!]
    created_at: String!
    updated_at: String!
    deleted_at: String
  }

  input CreateCustomerInput {
    code: String!
    name: String!
  }

  input UpdateCustomerInput {
    customer_id: String!
    code: String
    name: String
  }
`
