import { Customer } from '@modules/customers/infra/prisma/entities/Customer'
import { ICreateCustomer } from '../dtos/ICreateCustomer'

export interface ICustomersRepository {
  create(data: ICreateCustomer): Promise<Customer>
}
