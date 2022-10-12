import { container } from 'tsyringe'

import { IAppContext } from '@shared/infra/apollo/context'
import { ShowCustomerService } from '@modules/customers/services/ShowCustomerService'

interface ICustomerInput {
  id: string
}

export const customer = async (_: any, { id }: ICustomerInput, ctx: IAppContext) => {
  const { user_id: authenticatedUserId } = ctx.authentication

  const showCustomerService = container.resolve(ShowCustomerService)

  const findedCustomer = await showCustomerService.execute({
    customerId: id,
    authenticatedUserId: authenticatedUserId ?? '',
  })

  return findedCustomer
}
