import { gql } from 'apollo-server'

export const userTypeDefs = gql`
  extend type Query {
    user(id: ID!): User!
    users(data: ApiFiltersInput!): [User!]!
  }

  extend type Mutation {
    createUser(data: CreateUserInput!): User!
    updateUser(data: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
    loginUser(data: LoginUserInput): LoginUserResponse!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    username: String!
    created_at: String!
    updated_at: String!
  }

  type LoginUserResponse {
    token: String!
    user_id: ID!
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

  input LoginUserInput {
    emailOrUsername: String!
    password: String!
  }
`
