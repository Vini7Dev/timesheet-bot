import { inject, injectable } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'
import { Customer } from '../infra/prisma/entities/Customer'
import { ICustomersRepository } from '../repositories/ICustomersRepository'

interface IServiceProps {
  page?: number
  perPage?: number
}

@injectable()
export class ListCustomersService {
  constructor (
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({
    page,
    perPage,
  }: IServiceProps): Promise<Customer[]> {
    const customersList = await this.customersRepository.list({ page, perPage })

    return customersList
  }
}
