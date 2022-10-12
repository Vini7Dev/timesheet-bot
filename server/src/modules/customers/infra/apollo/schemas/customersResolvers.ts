import { customers } from './resolvers/customersResolver'
import { createCustomer } from './resolvers/createCustomerResolver'
import { updateCustomer } from './resolvers/customerUserResolver'
import { deleteCustomer } from './resolvers/deleteCustomerResolver'

export const customersResolvers = {
  Query: { customers },
  Mutation: { createCustomer, updateCustomer, deleteCustomer },
}
