import { container } from 'tsyringe'

import { IAppContext } from '@shared/infra/apollo/context'
import { ShowCustomerService } from '@modules/customers/services/ShowCustomerService'
import { ensureAuthenticated } from '@utils/ensureAuthenticated'

interface ICustomerInput {
  id: string
}

export const customer = async (_: any, { id }: ICustomerInput, ctx: IAppContext) => {
  ensureAuthenticated(ctx)

  const showCustomerService = container.resolve(ShowCustomerService)

  const findedCustomer = await showCustomerService.execute({
    customer_id: id,
  })

  return findedCustomer
}
