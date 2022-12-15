import { container } from 'tsyringe'

import { DeleteProjectService } from '@modules/projects/services/DeleteProjectService'
import { IAppContext } from '@shared/infra/apollo/context'
import { ensureAuthenticated } from '@utils/ensureAuthenticated'

interface IDeleteProjectInput {
  id: string
}

export const deleteProject = async (
  _: any,
  { id }: IDeleteProjectInput,
  ctx: IAppContext,
) => {
  ensureAuthenticated(ctx)

  const deleteProjectService = container.resolve(DeleteProjectService)

  const deletedProjectId = await deleteProjectService.execute({
    project_id: id
  })

  return deletedProjectId
}
