import { WorkClass } from '@prisma/client'

import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository'
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { FakeMarkingsRepository } from '../repositories/fakes/FakeMarkingsRepository'
import { IMarkingsRepository } from '../repositories/IMarkingsRepository'
import { UpdateManyMarkingsTimesheetStatus } from './UpdateManyMarkingsTimesheetStatus'
import { AppError } from '@shared/errors/AppError'

let usersRepository: IUsersRepository
let markingsRepository: IMarkingsRepository
let updateManyMarkingsTimesheetStatus: UpdateManyMarkingsTimesheetStatus

describe('UpdateManyMarkingsTimesheetStatus', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository()
    markingsRepository = new FakeMarkingsRepository()
    updateManyMarkingsTimesheetStatus = new UpdateManyMarkingsTimesheetStatus()
  })

  it('should be able to update many markings timesheet status', async () => {
    const authenticatedUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const createdMarking = await markingsRepository.create({
      description: 'Description Example - 1',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      work_class: WorkClass.PRODUCTION,
      project_id: 'any-project-id',
      user_id: authenticatedUser.id
    })

    const updatedMarking = await markingsRepository.create({
      description: 'Description Example - 2',
      date: '02/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      work_class: WorkClass.PRODUCTION,
      project_id: 'any-project-id',
      user_id: authenticatedUser.id
    })

    const deletedMarking = await markingsRepository.create({
      description: 'Description Example - 3',
      date: '03/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      work_class: WorkClass.PRODUCTION,
      project_id: 'any-project-id',
      user_id: authenticatedUser.id
    })

    const { markingStatusUpdated } = await updateManyMarkingsTimesheetStatus.execute({
      authenticatedUserId: authenticatedUser.id,
      markingStatusUpdated: [
        {
          marking_id: createdMarking.id,
          on_timesheet_id: 'created-marking-timesheet-id',
          on_timesheet_status: 'SENT',
        },
        {
          marking_id: updatedMarking.id,
          on_timesheet_id: 'updated-marking-timesheet-id',
          on_timesheet_status: 'ERROR',
          timesheet_error: ['Error example 1', 'Error example 2']
        },
        {
          marking_id: deletedMarking.id,
          on_timesheet_id: 'deleted-marking-timesheet-id',
          on_timesheet_status: 'NOT_SENT',
        },
      ]
    })

    expect(markingStatusUpdated).toHaveLength(3)

    expect(markingStatusUpdated[0].marking_id).toEqual(createdMarking.id)
    expect(markingStatusUpdated[0].on_timesheet_id).toEqual('created-marking-timesheet-id')
    expect(markingStatusUpdated[0].on_timesheet_status).toEqual('SENT')

    expect(markingStatusUpdated[1].marking_id).toEqual(updatedMarking.id)
    expect(markingStatusUpdated[1].on_timesheet_id).toEqual('updated-marking-timesheet-id')
    expect(markingStatusUpdated[1].on_timesheet_status).toEqual('ERROR')
    expect(markingStatusUpdated[1].timesheet_error).toEqual(['Error example 1', 'Error example 2'])

    expect(markingStatusUpdated[2].marking_id).toEqual(deletedMarking.id)
    expect(markingStatusUpdated[2].on_timesheet_id).toEqual('deleted-marking-timesheet-id')
    expect(markingStatusUpdated[2].on_timesheet_status).toEqual('NOT_SENT')
  })

  it('should not be able to update status of a non-existent marking', async () => {
    const authenticatedUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const existentMarking = await markingsRepository.create({
      description: 'Description Example - 1',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      work_class: WorkClass.PRODUCTION,
      project_id: 'any-project-id',
      user_id: authenticatedUser.id
    })

    const { markingStatusUpdated } = await updateManyMarkingsTimesheetStatus.execute({
      authenticatedUserId: authenticatedUser.id,
      markingStatusUpdated: [
        {
          marking_id: existentMarking.id,
          on_timesheet_id: 'existent-marking-timesheet-id',
          on_timesheet_status: 'SENT',
        },
        {
          marking_id: 'invalid-marking-id',
          on_timesheet_id: 'non-existent-marking-timesheet-id',
          on_timesheet_status: 'SENT',
        },
      ]
    })

    expect(markingStatusUpdated).toHaveLength(3)

    expect(markingStatusUpdated[0].marking_id).toEqual(existentMarking.id)
    expect(markingStatusUpdated[0].on_timesheet_id).toEqual('existent-marking-timesheet-id')
    expect(markingStatusUpdated[0].on_timesheet_status).toEqual('SENT')

    expect(markingStatusUpdated[1].marking_id).toEqual('invalid-marking-id')
    expect(markingStatusUpdated[1].on_timesheet_id).toEqual(null)
    expect(markingStatusUpdated[1].on_timesheet_status).toEqual('NOT_SENT')
    expect(markingStatusUpdated[1].error).toEqual(
      new AppError('Marking not found!', 404)
    )
  })

  it('should not be able to update markings status with a non-existent user', async () => {
    const createdMarking = await markingsRepository.create({
      description: 'Description Example',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      work_class: WorkClass.PRODUCTION,
      project_id: 'any-project-id',
      user_id: 'any-user-id'
    })

    await expect(
      updateManyMarkingsTimesheetStatus.execute({
        authenticatedUserId: 'invalid-user-id',
        markingStatusUpdated: [{
          marking_id: createdMarking.id,
          on_timesheet_id: 'created-marking-timesheet-id',
          on_timesheet_status: 'SENT',
        }]
      })
    ).rejects.toEqual(new AppError('User not found!', 404))
  })

  it("should not be able to update another user's markings status", async () => {
    const authenticatedUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@mail.com',
      username: 'jhon.doe',
      password: 'jhon123',
    })

    const userMarking = await markingsRepository.create({
      description: 'Description Example - 1',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      work_class: WorkClass.PRODUCTION,
      project_id: 'any-project-id',
      user_id: authenticatedUser.id
    })

    const anotherUserMarking = await markingsRepository.create({
      description: 'Description Example - 2',
      date: '01/01/2022',
      start_time: '09:00',
      finish_time: '12:00',
      work_class: WorkClass.PRODUCTION,
      project_id: 'any-project-id',
      user_id: 'another-user-id'
    })

    const { markingStatusUpdated } = await updateManyMarkingsTimesheetStatus.execute({
      authenticatedUserId: authenticatedUser.id,
      markingStatusUpdated: [
        {
          marking_id: userMarking.id,
          on_timesheet_id: 'user-marking-timesheet-id',
          on_timesheet_status: 'SENT',
        },
        {
          marking_id: anotherUserMarking.id,
          on_timesheet_id: 'another-user-marking-timesheet-id',
          on_timesheet_status: 'SENT',
        },
      ]
    })

    expect(markingStatusUpdated).toHaveLength(2)

    expect(markingStatusUpdated[0].marking_id).toEqual(userMarking.id)
    expect(markingStatusUpdated[0].on_timesheet_id).toEqual('created-marking-timesheet-id')
    expect(markingStatusUpdated[0].on_timesheet_status).toEqual('SENT')

    expect(markingStatusUpdated[1].marking_id).toEqual(anotherUserMarking.id)
    expect(markingStatusUpdated[1].on_timesheet_id).toBeNull()
    expect(markingStatusUpdated[1].on_timesheet_status).toEqual('NOT_SENT')
    expect(markingStatusUpdated[1].error).toEqual(
      new AppError('You do not have permission to update this marking!', 403)
    )
  })
})
