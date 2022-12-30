import { gql } from 'apollo-server'

import { userTypeDefs } from '@modules/users/infra/apollo/schemas/userTypeDefs'
import { userResolvers } from '@modules/users/infra/apollo/schemas/userResolvers'
import { customersTypeDefs } from '@modules/customers/infra/apollo/schemas/customersTypeDefs'
import { customersResolvers } from '@modules/customers/infra/apollo/schemas/customersResolvers'
import { projectsTypeDefs } from '@modules/projects/infra/apollo/schemas/projectsTypeDefs'
import { projectsResolvers } from '@modules/projects/infra/apollo/schemas/projectsResolvers'
import { markingsTypeDefs } from '@modules/markings/infra/apollo/schemas/markingsTypeDefs'
import { markingsResolvers } from '@modules/markings/infra/apollo/schemas/markingsResolvers'

const rootTypeDefs = gql`
  type Query {
    _empty: Boolean
  }

  type Mutation {
    _empty: Boolean
  }

  type Subscription {
    _empty: Boolean
  }

  type TimesheetMarkingResponse {
    id: String!
    on_timesheet_status: OnTimesheetStatus!
    timesheet_error: String
  }

  type AppError {
    message: String!
    code: Int!
  }

  input ApiFiltersInput {
    page: Int
    perPage: Int
    search: String
  }
`

const rootResolvers = {
  Query: {
    _empty: () => true,
  },
  Mutation: {
    _empty: () => true,
  },
  Subscription: {
    _empty: () => true,
  }
}

export const typeDefs = [
  rootTypeDefs,
  userTypeDefs,
  customersTypeDefs,
  projectsTypeDefs,
  markingsTypeDefs,
]

export const resolvers = [
  rootResolvers,
  userResolvers,
  customersResolvers,
  projectsResolvers,
  markingsResolvers,
]
