import { gql } from 'apollo-server'

export const projectsTypeDefs = gql`
  extend type Query {
    project(id: ID!): Project!
    projects(data: ApiFiltersInput!): [Project!]!
  }

  extend type Mutation {
    createProject(data: CreateProjectInput!): Project!
    updateProject(data: UpdateProjectInput!): Project!
    deleteProject(id: ID!): String!
  }

  type Project {
    id: String!
    code: String!
    name: String!
    customer: Customer
    created_at: String!
    updated_at: String!
  }

  input CreateProjectInput {
    code: String!
    name: String!
    customer_id: String!
  }

  input UpdateProjectInput {
    projectId: String!
    code: String
    name: String
  }
`
