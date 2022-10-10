import { ICreateCustomer } from '@modules/customers/dtos/ICreateCustomer';
import { Customer } from '@modules/customers/infra/prisma/entities/Customer';
import { ICustomersRepository } from '../ICustomersRepository'

export class FakeCustomersRepository implements ICustomersRepository {
  public async create(data: ICreateCustomer): Promise<Customer> {
    throw new Error('Method not implemented.');
  }
}
