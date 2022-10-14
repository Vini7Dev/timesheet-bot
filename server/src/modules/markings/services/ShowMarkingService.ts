import { AppError } from '@shared/errors/AppError';
import { Marking } from '../infra/prisma/entities/Marking';
import { IMarkingsRepository } from '../repositories/IMarkingsRepository'

export class ShowMarkingService {
  constructor (
    private markingsRepository: IMarkingsRepository,
  ) {}

  public async execute(id: string): Promise<Marking> {
    const findedMarking = await this.markingsRepository.findById(id)

    if(!findedMarking) {
      throw new AppError('Marking not found!', 404)
    }

    return findedMarking
  }
}
