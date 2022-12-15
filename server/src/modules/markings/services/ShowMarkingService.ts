import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';
import { Marking } from '../infra/prisma/entities/Marking';
import { IMarkingsRepository } from '../repositories/IMarkingsRepository'

interface IServiceProps {
  marking_id: string
}

@injectable()
export class ShowMarkingService {
  constructor (
    @inject('MarkingsRepository')
    private markingsRepository: IMarkingsRepository,
  ) {}

  public async execute({ marking_id }: IServiceProps): Promise<Marking> {
    const findedMarking = await this.markingsRepository.findById(marking_id)

    if(!findedMarking) {
      throw new AppError('Marking not found!', 404)
    }

    return findedMarking
  }
}
