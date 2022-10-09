import { gql } from 'apollo-server'

export const userTypeDefs = gql`
  extend type Query {
    user(id: ID!): User!
    users(input: ApiFiltersInput): [User!]!
  }

  extend type Mutation {
    createUser(data: CreateUserInput!): User!
    updateUser(data: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    username: String!
    created_at: String!
    updated_at: String!
  }

  input CreateUserInput {
    name: String!
    email: String!
    username: String!
    password: String!
  }

  input UpdateUserInput {
    name: String
    new_password: String
    current_password: String
  }
`
