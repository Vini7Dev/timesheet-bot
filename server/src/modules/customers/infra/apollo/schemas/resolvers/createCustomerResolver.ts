import { container } from 'tsyringe'

import { CreateCustomerService } from '@modules/customers/services/CreateCustomerService'
import { IAppContext } from '@shared/infra/apollo/context'

interface ICreateCustomerInput {
  data: {
    code: string
    name: string
  }
}

export const createCustomer = async (
  _: any,
  { data: { code, name } }: ICreateCustomerInput,
  ctx: IAppContext
) => {
  const { user_id: authenticatedUserId } = ctx.authentication

  const createCustomerService = container.resolve(CreateCustomerService)

  const createdCustomer = await createCustomerService.execute({
    code,
    name,
    authenticatedUserId: authenticatedUserId ?? '',
  })

  return createdCustomer
}
