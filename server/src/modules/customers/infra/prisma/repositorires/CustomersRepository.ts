import { ICreateCustomer } from '@modules/customers/dtos/ICreateCustomer';
import { ICustomersRepository } from '@modules/customers/repositories/ICustomersRepository'
import { Customer } from '../entities/Customer';
import { AppRepository } from '@shared/infra/prisma/repositories/AppRepository';

export class CustomersRepository extends AppRepository implements ICustomersRepository {
  public async findByCode(code: string): Promise<Customer | null> {
    const findedCustomer = await this.client.customers.findFirst({
      where: { code }
    })

    return findedCustomer
  }

  public async list({
    page = 0,
    perPage = 10,
  }: { page?: number, perPage?: number }): Promise<Customer[]> {
    const customerList = await this.client.customers.findMany({
      skip: page,
      take: perPage,
    })

    return customerList
  }

  public async create({ code, name }: ICreateCustomer): Promise<Customer> {
    const createdCustomer = await this.client.customers.create({
      data: { code, name }
    })

    return createdCustomer
  }
}
