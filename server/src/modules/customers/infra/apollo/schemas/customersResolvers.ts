import { customers } from './resolvers/customersResolver'
import { createCustomer } from './resolvers/createCustomerResolver'

export const customersResolvers = {
  Query: { customers },
  Mutation: { createCustomer },
}
