import { inject, injectable } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'
import { Customer } from '../infra/prisma/entities/Customer'
import { ICustomersRepository } from '../repositories/ICustomersRepository'

interface IServiceProps {
  code?: string
  name?: string
  customer_id: string
}

@injectable()
export class UpdateCustomerService {
  constructor (
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({
    customer_id,
    code,
    name,
  }: IServiceProps): Promise<Customer> {
    const customerToUpdate = await this.customersRepository.findById(customer_id)

    if (!customerToUpdate) {
      throw new AppError('Customer not found!', 404)
    }

    if (code) {
      const customerWithSameCode = await this.customersRepository.findByCode(code)

      if(customerWithSameCode && customerWithSameCode.id !== customerToUpdate.id) {
        throw new AppError('This code already exists!')
      }
    }

    const dataToUpdateCustomer = {
      id: customer_id,
      code: code ?? customerToUpdate.code,
      name: name ?? customerToUpdate.name,
    }

    const updatedCustomer = await this.customersRepository.update(dataToUpdateCustomer)

    return updatedCustomer
  }
}
