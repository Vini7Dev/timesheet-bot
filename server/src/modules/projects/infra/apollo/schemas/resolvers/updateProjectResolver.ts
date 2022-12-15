import { container } from 'tsyringe'

import { IAppContext } from '@shared/infra/apollo/context'
import { ensureAuthenticated } from '@utils/ensureAuthenticated'
import { UpdateProjectService } from '@modules/projects/services/UpdateProjectService'

interface IUpdateProjectInput {
  data: {
    project_id: string
    code?: string
    name?: string
  }
}

export const updateProject = async (
  _: any,
  { data: { project_id, code, name } }: IUpdateProjectInput,
  ctx: IAppContext
) => {
  ensureAuthenticated(ctx)

  const updateProjectService = container.resolve(UpdateProjectService)

  const updatedProject = await updateProjectService.execute({
    project_id,
    code,
    name,
  })

  return updatedProject
}
