import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';
import { Marking } from '../infra/prisma/entities/Marking';
import { IMarkingsRepository } from '../repositories/IMarkingsRepository'

interface IServiceProps {
  markingId: string
}

@injectable()
export class ShowMarkingService {
  constructor (
    @inject('MarkingsRepository')
    private markingsRepository: IMarkingsRepository,
  ) {}

  public async execute({ markingId }: IServiceProps): Promise<Marking> {
    const findedMarking = await this.markingsRepository.findById(markingId)

    if(!findedMarking) {
      throw new AppError('Marking not found!', 404)
    }

    return findedMarking
  }
}
