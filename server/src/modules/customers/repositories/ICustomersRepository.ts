import { Customer } from '@modules/customers/infra/prisma/entities/Customer'
import { ICreateCustomerDTO } from '../dtos/ICreateCustomerDTO'
import { IListCustomersDTO } from '../dtos/IListCustomersDTO'
import { IUpdateCustomerDTO } from '../dtos/IUpdateCustomerDTO'

export interface ICustomersRepository {
  findById(id: string): Promise<Customer | null>
  findByCode(code: string): Promise<Customer | null>
  list(filters: IListCustomersDTO): Promise<Customer[]>
  create(data: ICreateCustomerDTO): Promise<Customer>
  update(data: IUpdateCustomerDTO): Promise<Customer>
  delete(id: string): Promise<string>
}
