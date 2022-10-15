import { gql } from 'apollo-server'

import { userTypeDefs } from '@modules/users/infra/apollo/schemas/userTypeDefs'
import { userResolvers } from '@modules/users/infra/apollo/schemas/userResolvers'
import { customersTypeDefs } from '@modules/customers/infra/apollo/schemas/customersTypeDefs'
import { customersResolvers } from '@modules/customers/infra/apollo/schemas/customersResolvers'
import { projectsTypeDefs } from '@modules/projects/infra/apollo/schemas/projectsTypeDefs'
import { projectsResolvers } from '@modules/projects/infra/apollo/schemas/projectsResolvers'
import { markingsTypeDefs } from '@modules/markings/infra/apollo/schemas/markingsTypeDefs'
import { markingsResolvers } from '@modules/markings/infra/apollo/schemas/markingsResolvers'
import { IWSAppContext } from '../context'

const rootTypeDefs = gql`
  type Query {
    _empty: Boolean
  }

  type Mutation {
    _empty: Boolean
  }

  type Subscription {
    onCreateMarking: [TimesheetMarkingResponse!]!
  }

  type TimesheetMarkingResponse {
    id: String!
    on_timesheet_status: OnTimesheetStatus!
    timesheet_error: String
  }

  input ApiFiltersInput {
    page: Int
    perPage: Int
  }

  enum OnTimesheetStatus {
    NOT_SENT
    SENDING
    SENT
    ERROR
  }
`

const onCreateMarking = {
  subscribe: (
    _: any,
    __: any,
    { pubsub }: IWSAppContext,
  ) => {
    return pubsub.asyncIterator('CREATED_MARKING')
  },
}

const rootResolvers = {
  Query: {
    _empty: () => true,
  },
  Mutation: {
    _empty: () => true,
  },
  Subscription: {
    onCreateMarking,
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
