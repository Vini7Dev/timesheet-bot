import 'reflect-metadata'

import { WorkClass } from '@prisma/client'

import { AppError } from '@shared/errors/AppError'
import { FakeMarkingsRepository } from '../repositories/fakes/FakeMarkingsRepository'
import { IMarkingsRepository } from '../repositories/IMarkingsRepository'
import { DeleteMarkingService } from './DeleteMarkingService'

let markingsRepository: IMarkingsRepository
let deleteMarkingService: DeleteMarkingService

describe('DeleteMarkingService', () => {
  beforeEach(() => {
    markingsRepository = new FakeMarkingsRepository()
    deleteMarkingService = new DeleteMarkingService(
      markingsRepository,
    )
  })

  it('should be able to delete marking', async () => {
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

    const result = await deleteMarkingService.execute({
      marking_id: createdMarking.id,
    })

    expect(result).toEqual(createdMarking.id)
  })

  it ('should be able to delete marking with options', async () => {
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

    const result = await deleteMarkingService.execute({
      marking_id: createdMarking.id,
      options: { clearTimesheetId: true }
    })

    expect(result).toEqual(createdMarking.id)
  })

  it('should not be able to delete a non-existent marking', async () => {
    await expect(
      deleteMarkingService.execute({
        marking_id: 'invalid-marking-id',
      })
    ).rejects.toEqual(new AppError('Marking not found!', 404))
  })

  it('should not be able to delete marking if it has status sending in timesheet', async () => {
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
        marking_id: createdMarkingWithSendingStatus.id,
      })
    ).rejects.toEqual(new AppError('This marking is being processed in the timesheet'))
  })
})
