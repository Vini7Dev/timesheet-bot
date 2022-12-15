import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';
import { ICustomersRepository } from '../repositories/ICustomersRepository'

interface IServiceProps {
  customer_id: string
}

@injectable()
export class DeleteCustomerService {
  constructor (
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({
    customer_id,
  }: IServiceProps): Promise<string> {
    const customerToDelete = await this.customersRepository.findById(customer_id)

    if (!customerToDelete) {
      throw new AppError('Customer not found!', 404)
    }

    const customerIdDeleted = await this.customersRepository.delete(customer_id)

    return customerIdDeleted
  }
}
