import { inject, injectable } from 'tsyringe'

import { Customer } from '../infra/prisma/entities/Customer'
import { ICustomersRepository } from '../repositories/ICustomersRepository'

interface IServiceProps {
  page?: number
  perPage?: number
  search?: string
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
    search,
  }: IServiceProps): Promise<Customer[]> {
    const customersList = await this.customersRepository.list({ page, perPage, search })

    return customersList
  }
}
