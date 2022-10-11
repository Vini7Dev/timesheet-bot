import { Customer } from '@modules/customers/infra/prisma/entities/Customer'
import { ICreateCustomerDTO } from '../dtos/ICreateCustomerDTO'
import { IUpdateCustomerDTO } from '../dtos/IUpdateCustomerDTO'

export interface ICustomersRepository {
  findById(id: string): Promise<Customer | null>
  findByCode(code: string): Promise<Customer | null>
  list(filters: { page?: number, perPage?: number }): Promise<Customer[]>
  create(data: ICreateCustomerDTO): Promise<Customer>
  update(data: IUpdateCustomerDTO): Promise<Customer>
}
