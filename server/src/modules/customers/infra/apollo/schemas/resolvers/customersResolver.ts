import { container } from 'tsyringe'

import { ListUsersService } from '@modules/users/services/ListUsersService'
import { IAppContext } from '@shared/infra/apollo/context'
import { ListCustomersService } from '@modules/customers/services/ListCustomersService'
import { ensureAuthenticated } from '@utils/ensureAuthenticated'

interface IApiFiltersInput {
  data: {
    page?: number
    perPage?: number
    search?: string
  }
}

export const customers = async (
  _: any, {
    data: { page, perPage, search }
  }: IApiFiltersInput,
  ctx: IAppContext,
) => {
  ensureAuthenticated(ctx)

  const listCustomersService = container.resolve(ListCustomersService)

  const customerList = await listCustomersService.execute({
    page,
    perPage,
    search,
  })

  return customerList
}
