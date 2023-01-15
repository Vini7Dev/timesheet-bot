import { container } from 'tsyringe'

import { ListUsersService } from '@modules/users/services/ListUsersService'
import { IAppContext } from '@shared/infra/apollo/context'
import { ensureAuthenticated } from '@utils/ensureAuthenticated'

interface IApiFiltersInput {
  data: {
    page?: number
    perPage?: number
    search?: string
  }
}

export const users = async (
  _: any, {
    data: { page, perPage, search }
  }: IApiFiltersInput,
  ctx: IAppContext,
) => {
  ensureAuthenticated(ctx)

  const listUsersService = container.resolve(ListUsersService)

  const usersList = await listUsersService.execute({
    page,
    perPage,
    search,
  })

  return usersList
}
