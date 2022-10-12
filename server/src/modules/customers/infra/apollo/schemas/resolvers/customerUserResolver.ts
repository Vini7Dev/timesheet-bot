import { container } from 'tsyringe'

import { IAppContext } from '@shared/infra/apollo/context'
import { UpdateCustomerService } from '@modules/customers/services/UpdateCustomerService'

interface IUpdateCustomerInput {
  data: {
    customerId: string
    code?: string
    name?: string
  }
}

export const updateCustomer = async (
  _: any,
  {
    data: {
      customerId,
      code,
      name,
    }
  }: IUpdateCustomerInput,
  ctx: IAppContext
) => {
  const { user_id: authenticatedUserId } = ctx.authentication

  const customerProfileService = container.resolve(UpdateCustomerService)

  const updatedCustomer = await customerProfileService.execute({
    authenticatedUserId: authenticatedUserId ?? '',
    customerId,
    code,
    name,
  })

  return updatedCustomer
}
