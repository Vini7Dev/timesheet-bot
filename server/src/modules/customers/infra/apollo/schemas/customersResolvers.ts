import { customer } from './resolvers/customerResolver'
import { customers } from './resolvers/customersResolver'
import { createCustomer } from './resolvers/createCustomerResolver'
import { updateCustomer } from './resolvers/customerUserResolver'
import { deleteCustomer } from './resolvers/deleteCustomerResolver'

export const customersResolvers = {
  Query: { customer, customers },
  Mutation: { createCustomer, updateCustomer, deleteCustomer },
}
