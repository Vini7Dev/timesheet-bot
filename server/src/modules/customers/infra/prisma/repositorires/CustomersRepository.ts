import { ICreateCustomerDTO } from '@modules/customers/dtos/ICreateCustomerDTO';
import { IUpdateCustomerDTO } from '@modules/customers/dtos/IUpdateCustomerDTO';
import { ICustomersRepository } from '@modules/customers/repositories/ICustomersRepository'
import { Customer } from '../entities/Customer';
import { AppRepository } from '@shared/infra/prisma/repositories/AppRepository';
import { IListCustomersDTO } from '@modules/customers/dtos/IListCustomersDTO';

export class CustomersRepository extends AppRepository implements ICustomersRepository {
  public async findById(id: string): Promise<Customer | null> {
    const findedCustomer = await this.client.customers.findFirst({
      where: { id, deleted_at: null },
      include: { projects: true, }
    })

    return findedCustomer
  }

  public async findByCode(code: string): Promise<Customer | null> {
    const findedCustomer = await this.client.customers.findFirst({
      where: { code, deleted_at: null },
      include: { projects: true }
    })

    return findedCustomer
  }

  public async list({
    page = 0,
    perPage = 10,
    search = '',
  }: IListCustomersDTO): Promise<Customer[]> {
    const customerList = await this.client.customers.findMany({
      skip: page,
      take: perPage,
      include: { projects: true },
      where: {
        name: { contains: search, mode: 'insensitive' },
        deleted_at: null
      },
      orderBy: { name: 'asc' }
    })

    return customerList
  }

  public async create({ code, name }: ICreateCustomerDTO): Promise<Customer> {
    const createdCustomer = await this.client.customers.create({
      data: { code, name }
    })

    return createdCustomer
  }

  public async update({ id, code, name }: IUpdateCustomerDTO): Promise<Customer> {
    const updatedCustomer = await this.client.customers.update({
      where: { id },
      data: {
        code,
        name,
        updated_at: new Date(),
      }
    })

    return updatedCustomer
  }

  public async delete(id: string): Promise<string> {
    await this.client.customers.update({
      data: { deleted_at: new Date() },
      where: { id }
    })

    return id
  }
}
