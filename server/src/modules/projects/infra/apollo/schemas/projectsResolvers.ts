import { projects } from './resolvers/projectsResolver'
import { createProject } from './resolvers/createProjectResolver'
import { updateProject } from './resolvers/updateProjectResolver'

export const projectsResolvers = {
  Query: { projects },
  Mutation: { createProject, updateProject }
}
