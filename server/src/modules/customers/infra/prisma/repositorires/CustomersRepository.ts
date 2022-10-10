import { ICreateCustomer } from '@modules/customers/dtos/ICreateCustomer';
import { ICustomersRepository } from '@modules/customers/repositories/ICustomersRepository'
import { Customer } from '@modules/customers/infra/prisma/entities/Customer';

export class CustomersRepository implements ICustomersRepository {
  public async create(data: ICreateCustomer): Promise<Customer> {
    throw new Error('Method not implemented.');
  }
}
