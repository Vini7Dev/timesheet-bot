import { ICreateCustomerDTO } from '@modules/customers/dtos/ICreateCustomerDTO';
import { IListCustomersDTO } from '@modules/customers/dtos/IListCustomersDTO';
import { IUpdateCustomerDTO } from '@modules/customers/dtos/IUpdateCustomerDTO';
import { Customer } from '@modules/customers/infra/prisma/entities/Customer';
import { AppError } from '@shared/errors/AppError';
import { ICustomersRepository } from '../ICustomersRepository'

export class FakeCustomersRepository implements ICustomersRepository {
  private customers: Customer[]

  constructor() {
    this.customers = []
  }

  public async findById(id: string): Promise<Customer | null> {
    const findedCustomer = this.customers.find(customer => customer.id === id)

    return findedCustomer ?? null
  }

  public async list({
    page = 0,
    perPage = 10,
    search,
  }: IListCustomersDTO): Promise<Customer[]> {
    const filteredCustomers = this.customers.slice(page, perPage + page)

    if (search) {
      return filteredCustomers.filter(
        customer => customer.name
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase())
      )
    }

    return filteredCustomers
  }

  public async findByCode(code: string): Promise<Customer | null> {
    const findedCustomer = this.customers.find(customer => customer.code === code)

    return findedCustomer ?? null
  }

  public async create({ code, name }: ICreateCustomerDTO): Promise<Customer> {
    const createDate = new Date()

    const createdCustomer = {
      id: Math.random().toString(),
      code,
      name,
      created_at: createDate,
      updated_at: createDate,
    }

    this.customers.push(createdCustomer)

    return createdCustomer
  }

  public async update({ id, name, code }: IUpdateCustomerDTO): Promise<Customer> {
    const customerToUpdateIndex = this.customers.findIndex(customer => customer.id === id)

    if(customerToUpdateIndex === -1) {
      throw new AppError('Customer not found!', 404)
    }

    const updatedCustomer = this.customers[customerToUpdateIndex]
    if (code) updatedCustomer.code = code
    if (name) updatedCustomer.name = name
    updatedCustomer.updated_at = (new Date(Date.now() + 10000))

    this.customers[customerToUpdateIndex] = updatedCustomer

    return updatedCustomer
  }

  public async delete(id: string): Promise<string> {
    const customerToDeleteIndex = this.customers.findIndex(customer => customer.id === id)

    if(customerToDeleteIndex !== -1) {
      this.customers.splice(customerToDeleteIndex, 1)
    }

    return id
  }
}
