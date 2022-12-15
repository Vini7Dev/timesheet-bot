import { container } from 'tsyringe'

import { IAppContext } from '@shared/infra/apollo/context'
import { UpdateCustomerService } from '@modules/customers/services/UpdateCustomerService'
import { ensureAuthenticated } from '@utils/ensureAuthenticated'

interface IUpdateCustomerInput {
  data: {
    customer_id: string
    code?: string
    name?: string
  }
}

export const updateCustomer = async (
  _: any,
  {
    data: {
      customer_id,
      code,
      name,
    }
  }: IUpdateCustomerInput,
  ctx: IAppContext
) => {
  ensureAuthenticated(ctx)

  const customerProfileService = container.resolve(UpdateCustomerService)

  const updatedCustomer = await customerProfileService.execute({
    customer_id,
    code,
    name,
  })

  return updatedCustomer
}
