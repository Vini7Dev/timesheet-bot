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
  ensureAuthenticated(ctx)

  const {
    authentication: { user_id }
  } = ctx

  const listMarkingsByUserService = container.resolve(ListMarkingsByUserService)

  const markingsList = await listMarkingsByUserService.execute({
    user_id: user_id!,
    page,
    perPage,
  })

  return markingsList
}
