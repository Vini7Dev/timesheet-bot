import { container } from 'tsyringe'

import { ListUsersService } from '@modules/users/services/ListUsersService'
import { IAppContext } from '@shared/infra/apollo/context'
import { ListCustomersService } from '@modules/customers/services/ListCustomersService'

interface IApiFiltersInput {
  data: {
    page?: number
    perPage?: number
  }
}

export const customers = async (
  _: any, {
    data: { page, perPage }
  }: IApiFiltersInput,
  ctx: IAppContext
) => {
  const { user_id: authenticatedUserId } = ctx.authentication

  const listCustomersService = container.resolve(ListCustomersService)

  const customerList = await listCustomersService.execute({
    page, perPage, authenticatedUserId: authenticatedUserId ?? '',
  })

  return customerList
}
