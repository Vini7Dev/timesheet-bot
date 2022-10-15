import 'reflect-metadata'

import { FakeProjectsRepository } from '@modules/projects/repositories/fakes/FakeProjectsRepository'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectsRepository'
import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository'
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { FakeMarkingsRepository } from '../repositories/fakes/FakeMarkingsRepository'
import { IMarkingsRepository } from '../repositories/IMarkingsRepository'
import { UpdateMarkingsService } from './UpdateMarkingsService'
import { AppError } from '@shared/errors/AppError'

enum WorkClass {
  PRODUCTION,
  ABSENCE
}

let markingsRepository: IMarkingsRepository
let usersRepository: IUsersRepository
let projectsRepository: IProjectsRepository
let updateMarkingsService: UpdateMarkingsService

describe('UpdateMarkingsService', () => {
  beforeEach(() => {
    markingsRepository = new FakeMarkingsRepository()
    usersRepository = new FakeUsersRepository()
    projectsRepository = new FakeProjectsRepository()
    updateMarkingsService = new UpdateMarkingsService(
      markingsRepository,
      usersRepository,
      projectsRepository,
    )
  })

  it('should be able to update marking', async () => {
    const authenticatedUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const projectReference = await projectsRepository.create({
      code: 'ABCDE',
      name: 'Project Example',
      customer_id: 'any-customer-id',
    })

    const createdMarking = await markingsRepository.create({
      description: 'Description Example',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      start_interval_time: '10:00',
      finish_interval_time: '11:00',
      work_class: WorkClass.PRODUCTION,
      project_id: projectReference.id,
      user_id: authenticatedUser.id,
    })

    const updatedMarking = await updateMarkingsService.execute({
      markingId: createdMarking.id,
      description: 'Updated Description Example',
      date: '02/01/2022',
      start_time: '10:00',
      finish_time: '13:00',
      start_interval_time: '11:00',
      finish_interval_time: '12:00',
      work_class: WorkClass.ABSENCE,
      project_id: projectReference.id,
      authenticatedUserId: authenticatedUser.id,
    })

    expect(updatedMarking).toHaveProperty('id')
    expect(updatedMarking.id).toEqual(createdMarking.id)
    expect(updatedMarking.description).toEqual('Updated Description Example')
    expect(updatedMarking.date).toEqual('02/01/2022')
    expect(updatedMarking.start_time).toEqual('10:00')
    expect(updatedMarking.finish_time).toEqual('13:00')
    expect(updatedMarking.start_interval_time).toEqual('11:00')
    expect(updatedMarking.finish_interval_time).toEqual('12:00')
    expect(updatedMarking.work_class).toEqual(WorkClass.ABSENCE)
    expect(updatedMarking.updated_at).not.toEqual(updatedMarking.created_at)
  })

  it('should not be able to update a non-existent marking', async () => {
    const authenticatedUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const projectReference = await projectsRepository.create({
      code: 'ABCDE',
      name: 'Project Example',
      customer_id: 'any-customer-id',
    })

    await expect(
      updateMarkingsService.execute({
        markingId: 'invalid-marking-id',
        description: 'Updated Description Example',
        date: '02/01/2022',
        start_time: '10:00',
        finish_time: '13:00',
        start_interval_time: '11:00',
        finish_interval_time: '12:00',
        work_class: WorkClass.ABSENCE,
        project_id: projectReference.id,
        authenticatedUserId: authenticatedUser.id,
      })
    ).rejects.toEqual(new AppError('Marking not found!', 404))
  })

  it('should not be able to update marking with a non-existent user', async () => {
    const userReference = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const projectReference = await projectsRepository.create({
      code: 'ABCDE',
      name: 'Project Example',
      customer_id: 'any-customer-id',
    })

    const createdMarking = await markingsRepository.create({
      description: 'Description Example',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      start_interval_time: '10:00',
      finish_interval_time: '11:00',
      work_class: WorkClass.PRODUCTION,
      project_id: projectReference.id,
      user_id: userReference.id,
    })

    await expect(
      updateMarkingsService.execute({
        markingId: createdMarking.id,
        description: 'Updated Description Example',
        date: '02/01/2022',
        start_time: '10:00',
        finish_time: '13:00',
        start_interval_time: '11:00',
        finish_interval_time: '12:00',
        work_class: WorkClass.ABSENCE,
        project_id: projectReference.id,
        authenticatedUserId: 'invalid-user-id',
      })
    ).rejects.toEqual(new AppError('User not found!', 404))
  })

  it('should not be able to update marking with a non-existent project', async () => {
    const userReference = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const projectReference = await projectsRepository.create({
      code: 'ABCDE',
      name: 'Project Example',
      customer_id: 'any-customer-id',
    })

    const createdMarking = await markingsRepository.create({
      description: 'Description Example',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      start_interval_time: '10:00',
      finish_interval_time: '11:00',
      work_class: WorkClass.PRODUCTION,
      project_id: projectReference.id,
      user_id: userReference.id,
    })

    await expect(
      updateMarkingsService.execute({
        markingId: createdMarking.id,
        description: 'Updated Description Example',
        date: '02/01/2022',
        start_time: '10:00',
        finish_time: '13:00',
        start_interval_time: '11:00',
        finish_interval_time: '12:00',
        work_class: WorkClass.ABSENCE,
        project_id: 'invalid-project-id',
        authenticatedUserId: userReference.id,
      })
    ).rejects.toEqual(new AppError('Project not found!', 404))
  })

  it('should not be able to update markings with parallel date time', async () => {
    const authenticatedUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const projectReference = await projectsRepository.create({
      code: 'ABCDE',
      name: 'Project Example',
      customer_id: 'any-customer-id',
    })

    await markingsRepository.create({
      description: 'Description Example 1',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      start_interval_time: '10:00',
      finish_interval_time: '11:00',
      work_class: WorkClass.PRODUCTION,
      project_id: projectReference.id,
      user_id: authenticatedUser.id,
    })

    const newMarkingToUpdate = await markingsRepository.create({
      description: 'Description Example 1',
      date: '01/01/2022',
      start_time: '15:00',
      finish_time: '18:00',
      start_interval_time: '16:00',
      finish_interval_time: '17:00',
      work_class: WorkClass.PRODUCTION,
      project_id: projectReference.id,
      user_id: authenticatedUser.id,
    })

    const dataToUpdateMarkingWithoutTimes = {
      markingId: newMarkingToUpdate.id,
      description: 'Description Example 2',
      date: '01/01/2022',
      work_class: WorkClass.PRODUCTION,
      project_id: projectReference.id,
      authenticatedUserId: authenticatedUser.id,
    }

    await expect(
      updateMarkingsService.execute({
        ...dataToUpdateMarkingWithoutTimes,
        start_time: '11:00',
        finish_time: '14:00',
      })
    ).rejects.toEqual(
      new AppError('Another task already exists in parallel date and time!')
    )

    await expect(
      updateMarkingsService.execute({
        ...dataToUpdateMarkingWithoutTimes,
        start_time: '08:00',
        finish_time: '10:00',
      })
    ).rejects.toEqual(
      new AppError('Another task already exists in parallel date and time!')
    )

    await expect(
      updateMarkingsService.execute({
        ...dataToUpdateMarkingWithoutTimes,
        start_time: '10:00',
        finish_time: '11:00',
      })
    ).rejects.toEqual(
      new AppError('Another task already exists in parallel date and time!')
    )
  })

  it('should not be able to update marking when only one of interval of the times are received', async () => {
    const authenticatedUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const projectReference = await projectsRepository.create({
      code: 'ABCDE',
      name: 'Project Example',
      customer_id: 'any-customer-id',
    })

    const createdMarking = await markingsRepository.create({
      description: 'Description Example 1',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      start_interval_time: '10:00',
      finish_interval_time: '11:00',
      work_class: WorkClass.PRODUCTION,
      project_id: projectReference.id,
      user_id: authenticatedUser.id,
    })

    const dataToUpdateMarkingWithoutIntervalTimes = {
      markingId: createdMarking.id,
      description: 'Description Example 2',
      date: '01/01/2022',
      work_class: WorkClass.PRODUCTION,
      project_id: projectReference.id,
      authenticatedUserId: authenticatedUser.id,
    }

    await expect(
      updateMarkingsService.execute({
        ...dataToUpdateMarkingWithoutIntervalTimes,
        start_interval_time: '10:00',
      })
    ).rejects.toEqual(new AppError('Only one of interval times was received!'))

    await expect(
      updateMarkingsService.execute({
        ...dataToUpdateMarkingWithoutIntervalTimes,
        finish_interval_time: '11:00',
      })
    ).rejects.toEqual(new AppError('Only one of interval times was received!'))
  })

  it('should not be able to update marking with interval times outsite the start and finish time range', async () => {
    const authenticatedUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const projectReference = await projectsRepository.create({
      code: 'ABCDE',
      name: 'Project Example',
      customer_id: 'any-customer-id',
    })

    const createdMarking = await markingsRepository.create({
      description: 'Description Example 1',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      start_interval_time: '10:00',
      finish_interval_time: '11:00',
      work_class: WorkClass.PRODUCTION,
      project_id: projectReference.id,
      user_id: authenticatedUser.id,
    })

    const dataToUpdateMarkingWithoutIntervalTimes = {
      markingId: createdMarking.id,
      description: 'Description Example 2',
      date: '01/01/2022',
      work_class: WorkClass.PRODUCTION,
      project_id: projectReference.id,
      authenticatedUserId: authenticatedUser.id,
    }

    await expect(
      updateMarkingsService.execute({
        ...dataToUpdateMarkingWithoutIntervalTimes,
        start_interval_time: '08:00',
        finish_interval_time: '10:00',
      })
    ).rejects.toEqual(new AppError('Interval times are outside of the start and finish times!'))

    await expect(
      updateMarkingsService.execute({
        ...dataToUpdateMarkingWithoutIntervalTimes,
        start_interval_time: '10:00',
        finish_interval_time: '13:00',
      })
    ).rejects.toEqual(new AppError('Interval times are outside of the start and finish times!'))

    await expect(
      updateMarkingsService.execute({
        ...dataToUpdateMarkingWithoutIntervalTimes,
        start_interval_time: '13:00',
        finish_interval_time: '14:00',
      })
    ).rejects.toEqual(new AppError('Interval times are outside of the start and finish times!'))

    await expect(
      updateMarkingsService.execute({
        ...dataToUpdateMarkingWithoutIntervalTimes,
        start_interval_time: '07:00',
        finish_interval_time: '08:00',
      })
    ).rejects.toEqual(new AppError('Interval times are outside of the start and finish times!'))
  })
})
