import { inject, injectable } from 'tsyringe';

import { IProjectsRepository } from '@modules/projects/repositories/IProjectsRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';
import { filterNumberBetweenInterval } from '@utils/filterNumberBetweenInterval';
import { checkIfTimeRangeIsInAnotherTimeRange } from '@utils/checkIfTimeRangeIsInAnotherTimeRange';
import { Marking } from '../infra/prisma/entities/Marking';
import { IMarkingsRepository } from '../repositories/IMarkingsRepository'


interface IServiceProps {
  description: string
  date: string
  start_time: string
  finish_time: string
  start_interval_time?: string
  finish_interval_time?: string
  is_billable: boolean
  project_id: string
  authenticatedUserId: string
}

@injectable()
export class CreateMarkingService {
  constructor (
    @inject('MarkingsRepository')
    private markingsRepository: IMarkingsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,
  ) {}

  public async execute({
    description,
    date,
    start_time,
    finish_time,
    start_interval_time,
    finish_interval_time,
    is_billable,
    project_id,
    authenticatedUserId,
  }: IServiceProps): Promise<Marking> {
    const startNumber = parseInt(start_time.replace(':', ''))
    const finishNumber = parseInt(finish_time.replace(':', ''))

    if (startNumber >= finishNumber) {
      throw new AppError('Start time cannot be equal or greater than finish time!')
    }

    if(start_interval_time || finish_interval_time) {
      if(!start_interval_time || !finish_interval_time) {
        throw new AppError('Only one of interval times was received!')
      }

      const startIntervalNumber = parseInt(start_interval_time.replace(':', ''))
      const finishIntervalNumber = parseInt(finish_interval_time.replace(':', ''))

      if (startIntervalNumber >= finishIntervalNumber) {
        throw new AppError('Start interval time cannot be equal or greater than finish interval time!')
      }

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
      const markingsList = await this.markingsRepository.listByUserId({
        user_id: userToRefer.id,
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

      const isParallel = checkIfTimeRangeIsInAnotherTimeRange({
        startNumber,
        finishNumber,
        compareStartNumber: compareStartNumber,
        compareFinishNumber: compareFinishNumber,
      })

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
      is_billable,
      project_id,
      user_id: userToRefer.id,
    })

    return createdMarking
  }
}
