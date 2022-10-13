import { container } from 'tsyringe'

import { CreateCustomerService } from '@modules/customers/services/CreateCustomerService'
import { IAppContext } from '@shared/infra/apollo/context'
import { ensureAuthenticated } from '@utils/ensureAuthenticated'

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
  const authenticatedUserId = ensureAuthenticated(ctx)

  const createCustomerService = container.resolve(CreateCustomerService)

  const createdCustomer = await createCustomerService.execute({
    code,
    name,
    authenticatedUserId,
  })

  return createdCustomer
}
