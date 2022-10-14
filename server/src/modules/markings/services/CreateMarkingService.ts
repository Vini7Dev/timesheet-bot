import { IProjectsRepository } from '@modules/projects/repositories/IProjectsRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { Marking } from '../infra/prisma/entities/Marking';
import { IMarkingsRepository } from '../repositories/IMarkingsRepository'

enum WorkClass {
  PRODUCTION,
  ABSENCE
}

interface IServiceProps {
  description: string
  date: string
  start_time: string
  finish_time: string
  start_interval_time?: string
  finish_interval_time?: string
  work_class: WorkClass
  user_id: string
  project_id: string
}

export class CreateMarkingService {
  constructor (
    private markingsRepository: IMarkingsRepository,

    private usersRepository: IUsersRepository,

    private projectsRepository: IProjectsRepository,
  ) {}

  public async execute(data: IServiceProps): Promise<Marking> {
    throw new Error('Method not implemented.')
  }
}
