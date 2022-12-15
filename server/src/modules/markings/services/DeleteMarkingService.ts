import { inject, injectable } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'
import { IMarkingsRepository } from '../repositories/IMarkingsRepository'

interface IServiceProps {
  marking_id: string
}

@injectable()
export class DeleteMarkingService {
  constructor (
    @inject('MarkingsRepository')
    private markingsRepository: IMarkingsRepository
  ) {}

  public async execute({ marking_id }: IServiceProps): Promise<string> {
    const markingToDelete = await this.markingsRepository.findById(marking_id)

    if (!markingToDelete) {
      throw new AppError('Marking not found!', 404)
    }

    const projectIdDeleted = await this.markingsRepository.delete(marking_id)

    return projectIdDeleted
  }
}
