import { marking } from './resolvers/markingResolver'
import { markings } from './resolvers/markingsResolver'
import { createMarking } from './resolvers/createMarkingResolver'
import { updateMarking } from './resolvers/updateMarkingResolver'
import { deleteMarking } from './resolvers/deleteMarkingResolver'

export const markingsResolvers = {
  Query: { marking, markings },
  Mutation: { createMarking, updateMarking, deleteMarking },
}
