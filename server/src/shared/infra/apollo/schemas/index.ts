import { gql } from 'apollo-server';

import { userTypeDefs } from '@modules/users/infra/apollo/schemas/userTypeDefs';
import { userResolvers } from '@modules/users/infra/apollo/schemas/userResolvers';
import { customersTypeDefs } from '@modules/customers/infra/apollo/schemas/customersTypeDefs';
import { customersResolvers } from '@modules/customers/infra/apollo/schemas/customersResolvers';
import { projectsTypeDefs } from '@modules/projects/infra/apollo/schemas/projectsTypeDefs';
import { projectsResolvers } from '@modules/projects/infra/apollo/schemas/projectsResolvers';
import { markingsTypeDefs } from '@modules/markings/infra/apollo/schemas/markingsTypeDefs';

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

  input ApiFiltersInput {
    page: Int
    perPage: Int
  }
`

const rootResolvers = {
  Query: {
    _empty: () => true,
  },
  Mutation: {
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
]
