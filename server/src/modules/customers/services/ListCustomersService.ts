import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { Customer } from '../infra/prisma/entities/Customer';
import { ICustomersRepository } from '../repositories/ICustomersRepository'

interface IServiceProps {
  authenticatedUserId: string
  page?: number
  perPage?: number
}

export class ListCustomersService {
  constructor (
    private customersRepository: ICustomersRepository,

    private usersRepository: IUsersRepository,
  ) {}

  public async execute(data: IServiceProps): Promise<Customer[]> {
    throw new Error('TEMP')
  }
}
