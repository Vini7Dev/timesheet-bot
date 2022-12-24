import { gql } from 'apollo-server'

export const markingsTypeDefs = gql`
  extend type Query {
    marking(id: ID!): Marking!
    markings(data: ApiFiltersInput!): [Marking!]!
    markingsByUserId(data: ApiFiltersInput!): [Marking!]!
  }

  extend type Mutation {
    createMarking(data: CreateMarkingInput!): Marking!
    updateMarking(data: UpdateMarkingInput!): Marking!
    deleteMarking(id: ID!): ID!
    sendMarkingsToTimesheet(data: SendMarkingsToTimesheetInput): Boolean!
  }

  extend type Subscription {
    onSendMarkingsToTimesheet: [TimesheetMarkingResponse!]!
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
    project_id: String
    description: String
    date: String
    start_time: String
    finish_time: String
    start_interval_time: String
    finish_interval_time: String
    work_class: WorkClass
  }

  input SendMarkingsToTimesheetInput {
    markingIds: [String!]!
  }

  enum WorkClass {
    PRODUCTION,
    ABSENCE
  }
`
