import { inject, injectable } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'
import { ICustomersRepository } from '../repositories/ICustomersRepository'
import { Customer } from '../infra/prisma/entities/Customer'

interface IServiceProps {
  name: string
  code: string
}

@injectable()
export class CreateCustomerService {
  constructor (
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({
    code,
    name,
  }: IServiceProps): Customer {
    const customerWithSameCode = await this.customersRepository.findByCode(code)

    if(customerWithSameCode) {
      throw new AppError('This code already exists!')
    }

    const createdCustomer = await this.customersRepository.create({
      code,
      name,
    })

    return createdCustomer
  }
}
