import { container } from 'tsyringe'

import { IAppContext } from '@shared/infra/apollo/context'
import { DeleteCustomerService } from '@modules/customers/services/DeleteCustomerService'

interface IDeleteCustomerInput {
  id: string
}

export const deleteCustomer = async (_: any, { id }: IDeleteCustomerInput, ctx: IAppContext) => {
  const { user_id: authenticatedUserId } = ctx.authentication

  const deleteCustomerService = container.resolve(DeleteCustomerService)

  const userIdDeleted = await deleteCustomerService.execute({
    customerId: id,
    authenticatedUserId: authenticatedUserId ?? '',
  })

  return userIdDeleted
}
