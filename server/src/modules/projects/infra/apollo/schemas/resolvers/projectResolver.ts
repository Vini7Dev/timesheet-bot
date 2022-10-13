import { container } from 'tsyringe'

import { IAppContext } from '@shared/infra/apollo/context'
import { ensureAuthenticated } from '@utils/ensureAuthenticated'
import { ShowProjectService } from '@modules/projects/services/ShowProjectService'

interface IProjectInput {
  id: string
}

export const project = async (
  _: any,
  { id }: IProjectInput,
  ctx: IAppContext
) => {
  ensureAuthenticated(ctx)

  const showProjectService = container.resolve(ShowProjectService)

  const findedProject = await showProjectService.execute({ projectId: id })

  return findedProject
}
