import { inject, injectable } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'
import { IMarkingsRepository } from '../repositories/IMarkingsRepository'

interface IServiceProps {
  markingId: string
}

@injectable()
export class DeleteMarkingService {
  constructor (
    @inject('MarkingsRepository')
    private markingsRepository: IMarkingsRepository
  ) {}

  public async execute({ markingId }: IServiceProps): Promise<string> {
    const markingToDelete = await this.markingsRepository.findById(markingId)

    if (!markingToDelete) {
      throw new AppError('Marking not found!', 404)
    }

    const projectIdDeleted = await this.markingsRepository.delete(markingId)

    return projectIdDeleted
  }
}