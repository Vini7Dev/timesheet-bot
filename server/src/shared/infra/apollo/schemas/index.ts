import { gql } from 'apollo-server';

import { userTypeDefs } from '@modules/users/infra/apollo/schemas/userTypeDefs';
import { userResolvers } from '@modules/users/infra/apollo/schemas/userResolvers';

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
    page: Int!
    perPage: Int!
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
]

export const resolvers = [
  rootResolvers,
  userResolvers,
]
