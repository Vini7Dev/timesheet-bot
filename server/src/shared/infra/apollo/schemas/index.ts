import { gql } from 'apollo-server';

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
]

export const resolvers = [
  rootResolvers,
]
