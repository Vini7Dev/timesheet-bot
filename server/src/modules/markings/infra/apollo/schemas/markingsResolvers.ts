import { createMarking } from './resolvers/createMarkingResolver'

export const markingsResolvers = {
  Query: {},
  Mutation: { createMarking },
}
