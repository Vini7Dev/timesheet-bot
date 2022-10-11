import { ICreateCustomer } from '@modules/customers/dtos/ICreateCustomer';
import { Customer } from '@modules/customers/infra/prisma/entities/Customer';
import { ICustomersRepository } from '../ICustomersRepository'

export class FakeCustomersRepository implements ICustomersRepository {
  private customers: Customer[]

  constructor() {
    this.customers = []
  }

  public async findByCode(code: string): Promise<Customer | null> {
    const findedCustomer = this.customers.find(customer => customer.code === code)

    return findedCustomer ?? null
  }

  public async create({
    code,
    name,
  }: ICreateCustomer): Promise<Customer> {
    const createdCustomer = {
      id: Math.random().toString(),
      code,
      name,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.customers.push(createdCustomer)

    return createdCustomer
  }
}
