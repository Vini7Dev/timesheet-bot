import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { Marking } from '../infra/prisma/entities/Marking';
import { IMarkingsRepository } from '../repositories/IMarkingsRepository'

interface IServiceProps {
  authenticatedUserId: string
  marking_id: string
}

@injectable()
export class ShowMarkingService {
  constructor (
    @inject('MarkingsRepository')
    private markingsRepository: IMarkingsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({
    authenticatedUserId,
    marking_id
  }: IServiceProps): Promise<Marking> {
    const authenticatedUser = await this.usersRepository.findById(authenticatedUserId)
    if (!authenticatedUser) {
      throw new AppError('User not found!', 404)
    }

    const findedMarking = await this.markingsRepository.findById(marking_id)
    if(!findedMarking) {
      throw new AppError('Marking not found!', 404)
    }

    if (findedMarking.user_id !== authenticatedUserId) {
      throw new AppError('You do not have permission to view this marking!', 403)
    }

    return findedMarking
  }
}
