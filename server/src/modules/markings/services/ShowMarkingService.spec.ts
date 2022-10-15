import 'reflect-metadata'

import { AppError } from '@shared/errors/AppError'
import { FakeMarkingsRepository } from '../repositories/fakes/FakeMarkingsRepository'
import { IMarkingsRepository } from '../repositories/IMarkingsRepository'
import { ShowMarkingService } from './ShowMarkingService'

enum WorkClass {
  PRODUCTION,
  ABSENCE
}

let markingsRepository: IMarkingsRepository
let showMarkingService: ShowMarkingService

describe('ShowMarkingService', () => {
  beforeEach(() => {
    markingsRepository = new FakeMarkingsRepository()
    showMarkingService = new ShowMarkingService(
      markingsRepository,
    )
  })

  it('should be able to show marking', async () => {
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

    const findedMarking = await showMarkingService.execute({
      markingId: createdMarking.id,
    })

    expect(findedMarking).toEqual(createdMarking)
  })

  it('should not be able to show a non-existent marking', async () => {
    await expect(
      showMarkingService.execute({
        markingId: 'invalid-marking-id',
      })
    ).rejects.toEqual(new AppError('Marking not found!', 404))
  })
})
