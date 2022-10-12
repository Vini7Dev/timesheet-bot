import { customers } from './resolvers/customersResolver'
import { createCustomer } from './resolvers/createCustomerResolver'
import { updateCustomer } from './resolvers/customerUserResolver'

export const customersResolvers = {
  Query: { customers },
  Mutation: { createCustomer, updateCustomer },
}
