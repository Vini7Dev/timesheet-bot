import { projects } from './resolvers/projectsResolver'
import { createProject } from './resolvers/createProjectResolver'

export const projectsResolvers = {
  Query: { projects },
  Mutation: { createProject }
}
