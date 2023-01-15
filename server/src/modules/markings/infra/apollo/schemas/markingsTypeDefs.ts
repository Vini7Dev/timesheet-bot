import { gql } from 'apollo-server'

export const markingsTypeDefs = gql`
  extend type Query {
    marking(id: ID!): Marking!
    markings(data: ApiMarkingFiltersInput!): [Marking!]!
    markingsByUserId(data: ApiMarkingFiltersInput!): [Marking!]!
  }

  extend type Mutation {
    createMarking(data: CreateMarkingInput!): Marking!
    updateMarking(data: UpdateMarkingInput!): Marking!
    deleteMarking(id: ID!): ID!
    sendMarkingsToTimesheet(data: SendMarkingsToTimesheetInput)
      : SendMarkingsToTimesheetResponse!
  }

  extend type Subscription {
    onSendMarkingsToTimesheet: [TimesheetMarkingResponse!]!
  }

  type Marking {
    id: ID!
    on_timesheet_id: String
    on_timesheet_status: OnTimesheetStatus
    timesheet_error: String
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
    deleted_at: String
  }

  enum OnTimesheetStatus {
    NOT_SENT
    SENDING
    SENT
    ERROR
  }

  type SendMarkingsToTimesheetResponse {
    markings: [TimesheetMarkingResult!]!
  }

  type TimesheetMarkingResult {
    id: String!
    data: Marking
    error: AppError
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
