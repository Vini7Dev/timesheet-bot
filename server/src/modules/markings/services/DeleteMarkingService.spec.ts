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

  it('should not be able to delete a non-existent marking', async () => {
    await expect(
      deleteMarkingService.execute({
        marking_id: 'invalid-marking-id',
      })
    ).rejects.toEqual(new AppError('Marking not found!', 404))
  })
})
