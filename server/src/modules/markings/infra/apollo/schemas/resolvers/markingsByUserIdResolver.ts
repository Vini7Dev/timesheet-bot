import { container } from 'tsyringe'

import { IAppContext } from '@shared/infra/apollo/context'
import { ensureAuthenticated } from '@utils/ensureAuthenticated'
import { ListMarkingsByUserService } from '@modules/markings/services/ListMarkingsByUserService'

interface IApiFiltersInput {
  data: {
    page?: number
    perPage?: number
  }
}

export const markingsByUserId = async (
  _: any,
  { data: { page, perPage } }: IApiFiltersInput,
  ctx: IAppContext,
) => {
  const authenticatedUserId = ensureAuthenticated(ctx)

  const listMarkingsByUserService = container.resolve(ListMarkingsByUserService)

  const markingsList = await listMarkingsByUserService.execute({
    authenticatedUserId: authenticatedUserId,
    page,
    perPage,
  })

  return markingsList
}
