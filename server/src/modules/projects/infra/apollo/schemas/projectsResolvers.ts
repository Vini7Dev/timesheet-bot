import { project } from './resolvers/projectResolver'
import { projects } from './resolvers/projectsResolver'
import { createProject } from './resolvers/createProjectResolver'
import { updateProject } from './resolvers/updateProjectResolver'

export const projectsResolvers = {
  Query: { project, projects },
  Mutation: { createProject, updateProject }
}
