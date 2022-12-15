import { gql } from 'apollo-server'

export const markingsTypeDefs = gql`
  extend type Query {
    marking(id: ID!): Marking!
    markings(data: ApiFiltersInput!): [Marking!]!
  }

  extend type Mutation {
    createMarking(data: CreateMarkingInput!): Marking!
    updateMarking(data: UpdateMarkingInput!): Marking!
    deleteMarking(id: ID!): ID!
  }

  type Marking {
    id: ID!
    description: String!
    date: String!
    start_time: String!
    finish_time: String!
    start_interval_time: String
    finish_interval_time: String
    work_class: WorkClass!
    user_id: String!
    user: User!
    project_id: String!
    project: Project!
    created_at: String!
    updated_at: String!
  }

  input CreateMarkingInput {
    description: String!
    date: String!
    start_time: String!
    finish_time: String!
    start_interval_time: String
    finish_interval_time: String
    work_class: WorkClass!
    project_id: String!
  }

  input UpdateMarkingInput {
    marking_id: String!
    description: String
    date: String
    start_time: String
    finish_time: String
    start_interval_time: String
    finish_interval_time: String
    work_class: WorkClass
  }

  enum WorkClass {
    PRODUCTION,
    ABSENCE
  }
`
