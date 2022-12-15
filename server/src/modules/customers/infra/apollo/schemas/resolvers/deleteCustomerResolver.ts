import { container } from 'tsyringe'

import { IAppContext } from '@shared/infra/apollo/context'
import { DeleteCustomerService } from '@modules/customers/services/DeleteCustomerService'
import { ensureAuthenticated } from '@utils/ensureAuthenticated'

interface IDeleteCustomerInput {
  id: string
}

export const deleteCustomer = async (_: any, { id }: IDeleteCustomerInput, ctx: IAppContext) => {
  ensureAuthenticated(ctx)

  const deleteCustomerService = container.resolve(DeleteCustomerService)

  const userIdDeleted = await deleteCustomerService.execute({
    customer_id: id,
  })

  return userIdDeleted
}
