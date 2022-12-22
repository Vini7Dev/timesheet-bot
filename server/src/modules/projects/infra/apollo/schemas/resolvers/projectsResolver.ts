import { container } from 'tsyringe'

import { IAppContext } from '@shared/infra/apollo/context'
import { ensureAuthenticated } from '@utils/ensureAuthenticated'
import { ListProjectsService } from '@modules/projects/services/ListProjectsService'

interface IApiFiltersInput {
  data: {
    page?: number
    perPage?: number
    search?: string
  }
}

export const projects = async (
  _: any,
  { data: { page, perPage, search } }: IApiFiltersInput,
  ctx: IAppContext,
) => {
  ensureAuthenticated(ctx)

  const listProjectsService = container.resolve(ListProjectsService)

  const projectsList = await listProjectsService.execute({
    page,
    perPage,
    search,
  })

  return projectsList
}
