import { container } from 'tsyringe'

import { IAppContext } from '@shared/infra/apollo/context'
import { ensureAuthenticated } from '@utils/ensureAuthenticated'
import { CreateProjectService } from '@modules/projects/services/CreateProjectService'

interface ICreateProjectInput {
  data: {
    code: string
    name: string
    customer_id: string
  }
}

export const createProject = async (
  _: any,
  { data: { code, name, customer_id } }: ICreateProjectInput,
  ctx: IAppContext
) => {
  ensureAuthenticated(ctx)

  const createProjectService = container.resolve(CreateProjectService)

  const createdProject = await createProjectService.execute({
    code,
    name,
    customer_id,
  })

  return createdProject
}
