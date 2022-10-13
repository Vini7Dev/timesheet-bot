import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';
import { ICustomersRepository } from '../repositories/ICustomersRepository'

interface IServiceProps {
  customerId: string
}

@injectable()
export class DeleteCustomerService {
  constructor (
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({
    customerId,
  }: IServiceProps): Promise<string> {
    const customerToDelete = await this.customersRepository.findById(customerId)

    if (!customerToDelete) {
      throw new AppError('Customer not found!', 404)
    }

    const customerIdDeleted = await this.customersRepository.delete(customerId)

    return customerIdDeleted
  }
}
