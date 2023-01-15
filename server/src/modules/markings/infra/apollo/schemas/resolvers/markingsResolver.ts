import { container } from 'tsyringe'

import { IAppContext } from '@shared/infra/apollo/context'
import { ensureAuthenticated } from '@utils/ensureAuthenticated'
import { ListMarkingsService } from '@modules/markings/services/ListMarkingsService'

interface IApiFiltersInput {
  data: {
    page?: number
    perPage?: number
    search?: string
  }
}

export const markings = async (
  _: any,
  { data: { page, perPage, search } }: IApiFiltersInput,
  ctx: IAppContext,
) => {
  ensureAuthenticated(ctx)

  const listMarkingsService = container.resolve(ListMarkingsService)

  const markingsList = await listMarkingsService.execute({
    page,
    perPage,
    search,
  })

  return markingsList
}
