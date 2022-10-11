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

  public async create({ code, name }: ICreateCustomer): Promise<Customer> {
    const createdCustomer = await this.client.customers.create({
      data: { code, name }
    })

    return createdCustomer
  }
}
