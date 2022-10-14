import { IProjectsRepository } from '@modules/projects/repositories/IProjectsRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';
import { filterNumberBetweenInterval } from '@utils/filterNumberBetweenInterval';
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
  project_id: string
  authenticatedUserId: string
}

export class CreateMarkingService {
  constructor (
    private markingsRepository: IMarkingsRepository,

    private usersRepository: IUsersRepository,

    private projectsRepository: IProjectsRepository,
  ) {}

  public async execute({
    description,
    date,
    start_time,
    finish_time,
    start_interval_time,
    finish_interval_time,
    work_class,
    project_id,
    authenticatedUserId,
  }: IServiceProps): Promise<Marking> {
    const startNumber = parseInt(start_time.replace(':', ''))
    const finishNumber = parseInt(finish_time.replace(':', ''))

    if(start_interval_time || finish_interval_time) {
      if(!start_interval_time || !finish_interval_time) {
        throw new AppError('Only one of interval times was received!')
      }

      const startIntervalNumber = parseInt(start_interval_time.replace(':', ''))
      const finishIntervalNumber = parseInt(finish_interval_time.replace(':', ''))

      const intervalTimeIsOnStartAndFinishRange = filterNumberBetweenInterval({
        startNumberInterval: startNumber,
        finishNumberInterval: finishNumber,
        numbersToVerify: [startIntervalNumber, finishIntervalNumber],
      }).length === 2

      if(!intervalTimeIsOnStartAndFinishRange) {
        throw new AppError('Interval times are outside of the start and finish times!')
      }
    }

    const userToRefer = await this.usersRepository.findById(authenticatedUserId)
    if (!userToRefer) {
      throw new AppError('User not found!', 404)
    }

    const projectToRefer = await this.projectsRepository.findById(project_id)
    if (!projectToRefer) {
      throw new AppError('Project not found!', 404)
    }

    let page = 0
    const perPage = 1000
    const markingsOfDate: Marking[] = []

    while (true) {
      const markingsList = await this.markingsRepository.list({
        page,
        perPage,
        date,
      })

      if(markingsList.length === 0) {
        break
      }

      markingsOfDate.push(...markingsList)
      page += 1
    }

    const parallelMarking = markingsOfDate.find(markingToCompare => {
      const {
        start_time: compareStartTime,
        finish_time: compareFinishTime
      } = markingToCompare

      const compareStartNumber = parseInt(compareStartTime.replace(':', ''))
      const compareFinishNumber = parseInt(compareFinishTime.replace(':', ''))

      const isParallel = filterNumberBetweenInterval({
        startNumberInterval: compareStartNumber,
        finishNumberInterval: compareFinishNumber,
        numbersToVerify: [startNumber, finishNumber],
      }).length !== 0

      return isParallel
    })

    if (parallelMarking) {
      throw new AppError('Another task already exists in parallel date and time!')
    }

    const createdMarking = await this.markingsRepository.create({
      description,
      date,
      start_time,
      finish_time,
      start_interval_time,
      finish_interval_time,
      work_class,
      project_id,
      user_id: userToRefer.id,
    })

    return createdMarking
  }
}
