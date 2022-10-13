import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';
import { ICustomersRepository } from '../repositories/ICustomersRepository'
import { Customer } from '../infra/prisma/entities/Customer';

interface IServiceProps {
  customerId: string
}

@injectable()
export class ShowCustomerService {
  constructor (
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({
    customerId,
  }: IServiceProps): Promise<Customer> {
    const findedCustomer = await this.customersRepository.findById(customerId)

    if (!findedCustomer) {
      throw new AppError('Customer not found!', 404)
    }

    return findedCustomer
  }
}
