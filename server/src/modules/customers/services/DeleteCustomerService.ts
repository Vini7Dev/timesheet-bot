import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';
import { ICustomersRepository } from '../repositories/ICustomersRepository'

interface IServiceProps {
  customerId: string
  authenticatedUserId: string
}

@injectable()
export class DeleteCustomerService {
  constructor (
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    authenticatedUserId,
    customerId,
  }: IServiceProps) {
    const authenticatedUser = await this.usersRepository.findById(authenticatedUserId)
    if (!authenticatedUser) {
      throw new AppError('You must be authenticated!', 401)
    }

    const customerIdDeleted = await this.customersRepository.delete(customerId)

    return customerIdDeleted
  }
}
