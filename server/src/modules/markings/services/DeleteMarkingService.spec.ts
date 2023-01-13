import 'reflect-metadata'

import { WorkClass } from '@prisma/client'

import { AppError } from '@shared/errors/AppError'
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository'
import { FakeMarkingsRepository } from '../repositories/fakes/FakeMarkingsRepository'
import { IMarkingsRepository } from '../repositories/IMarkingsRepository'
import { DeleteMarkingService } from './DeleteMarkingService'

let markingsRepository: IMarkingsRepository
let usersRepository: IUsersRepository
let deleteMarkingService: DeleteMarkingService

describe('DeleteMarkingService', () => {
  beforeEach(() => {
    markingsRepository = new FakeMarkingsRepository()
    usersRepository=  new FakeUsersRepository()
    deleteMarkingService = new DeleteMarkingService(
      markingsRepository,
      usersRepository,
    )
  })

  it('should be able to delete marking', async () => {
    const authenticatedUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const createdMarking = await markingsRepository.create({
      description: 'Description Example',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      start_interval_time: '10:00',
      finish_interval_time: '11:00',
      work_class: WorkClass.PRODUCTION,
      project_id: 'any-project-id',
      user_id: authenticatedUser.id
    })

    const result = await deleteMarkingService.execute({
      authenticatedUserId: authenticatedUser.id,
      marking_id: createdMarking.id,
    })

    expect(result).toEqual(createdMarking.id)
  })

  it ('should be able to delete marking with options', async () => {
    const authenticatedUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const createdMarking = await markingsRepository.create({
      description: 'Description Example',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      start_interval_time: '10:00',
      finish_interval_time: '11:00',
      work_class: WorkClass.PRODUCTION,
      project_id: 'any-project-id',
      user_id: authenticatedUser.id
    })

    const result = await deleteMarkingService.execute({
      authenticatedUserId: authenticatedUser.id,
      marking_id: createdMarking.id,
      options: { clearTimesheetId: true }
    })

    expect(result).toEqual(createdMarking.id)
  })

  it('should not be able to delete a non-existent marking', async () => {
    const authenticatedUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    await expect(
      deleteMarkingService.execute({
        authenticatedUserId: authenticatedUser.id,
        marking_id: 'invalid-marking-id',
      })
    ).rejects.toEqual(new AppError('Marking not found!', 404))
  })

  it('should not be able to delete marking with a non-existent user', async () => {
    const createdMarking = await markingsRepository.create({
      description: 'Description Example',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      start_interval_time: '10:00',
      finish_interval_time: '11:00',
      work_class: WorkClass.PRODUCTION,
      project_id: 'any-project-id',
      user_id: 'invalid-user-id'
    })

    await expect(deleteMarkingService.execute({
      authenticatedUserId: 'invalid-user-id',
      marking_id: createdMarking.id
    })).rejects.toEqual(new AppError('User not found!', 404))
  })

  it ("should not be able to delete different user's marking", async () => {
    const differentUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const createdMarking = await markingsRepository.create({
      description: 'Description Example',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      start_interval_time: '10:00',
      finish_interval_time: '11:00',
      work_class: WorkClass.PRODUCTION,
      project_id: 'any-project-id',
      user_id: 'any-user-id'
    })

    await expect(deleteMarkingService.execute({
      authenticatedUserId: differentUser.id,
      marking_id: createdMarking.id
    })).rejects.toEqual(new AppError('You do not have permission to delete this marking!', 403))
  })

  it('should not be able to delete marking if it has status sending in timesheet', async () => {
    const authenticatedUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const createdMarkingWithSendingStatus = await markingsRepository.create({
      description: 'Description Example',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      start_interval_time: '10:00',
      finish_interval_time: '11:00',
      work_class: WorkClass.PRODUCTION,
      project_id: 'any-project-id',
      user_id: 'any-user-id',
      on_timesheet_id: 'any-timesheet-id',
      on_timesheet_status: 'SENDING'
    })

    await expect(
      deleteMarkingService.execute({
        authenticatedUserId: authenticatedUser.id,
        marking_id: createdMarkingWithSendingStatus.id,
      })
    ).rejects.toEqual(new AppError('This marking is being processed in the timesheet'))
  })
})
