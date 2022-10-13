import { inject, injectable } from 'tsyringe';

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
    const customerIdDeleted = await this.customersRepository.delete(customerId)

    return customerIdDeleted
  }
}
