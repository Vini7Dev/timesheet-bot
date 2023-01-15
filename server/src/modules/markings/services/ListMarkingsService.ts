import { inject, injectable } from 'tsyringe'

import { Marking } from '../infra/prisma/entities/Marking'
import { IMarkingsRepository } from '../repositories/IMarkingsRepository'

interface IServiceProps {
  page?: number
  perPage?: number
  search?: string
}

@injectable()
export class ListMarkingsService {
  constructor (
    @inject('MarkingsRepository')
    private markingsRepository: IMarkingsRepository
  ) {}

  public async execute({ page, perPage, search }: IServiceProps): Promise<Marking[]> {
    const markingsList = await this.markingsRepository.list({ page, perPage, search })

    return markingsList
  }
}
