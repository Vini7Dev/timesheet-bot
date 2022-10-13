import { project } from './resolvers/projectResolver'
import { projects } from './resolvers/projectsResolver'
import { createProject } from './resolvers/createProjectResolver'
import { updateProject } from './resolvers/updateProjectResolver'
import { deleteProject } from './resolvers/deleteProjectResolver'

export const projectsResolvers = {
  Query: { project, projects },
  Mutation: { createProject, updateProject, deleteProject }
}
