import { Customer } from '@modules/customers/infra/prisma/entities/Customer'
import { ICreateCustomer } from '../dtos/ICreateCustomer'

export interface ICustomersRepository {
  findByCode(code: string): Promise<Customer | null>
  list(filters: { page?: number, perPage?: number }): Promise<Customer[]>
  create(data: ICreateCustomer): Promise<Customer>
}
