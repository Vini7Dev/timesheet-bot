import { OnTimesheetStatus } from '@prisma/client'

import { CREATED_MARKING } from '@shared/infra/apollo/schemas/subscriptions/channels'
import { ICrawler } from '../models/ICrawler'
import { IDeleteMarkingsDTO } from '../dtos/IDeleteMarkingsDTO'
import { IMarkingResponseDTO } from '../dtos/IMarkingResponseDTO'
import { ISaveMarkingsDTO } from '../dtos/ISaveMarkingsDTO'
import { IUpdateMarkingsDTO } from '../dtos/IUpdateMarkingsDTO'

export class FakeCrawlerProvider implements ICrawler {
  public async saveTimesheetTasks({
    markings,
    pubsub,
  }: ISaveMarkingsDTO): Promise<IMarkingResponseDTO[]> {
    const markingsResponse = markings.map(marking => ({
      id: marking.id,
      on_timesheet_status: OnTimesheetStatus.SENT,
    }))

    await pubsub.publish(CREATED_MARKING, {
      onCreateMarking: markingsResponse,
    })

    return markingsResponse
  }

  public async updateTimesheetTasks({
    markings,
    pubsub,
  }: IUpdateMarkingsDTO): Promise<IMarkingResponseDTO[]> {
    const markingsResponse = markings.map(marking => ({
      id: marking.id,
      on_timesheet_status: OnTimesheetStatus.SENT,
    }))

    await pubsub.publish(CREATED_MARKING, {
      onCreateMarking: markingsResponse,
    })

    return markingsResponse
  }

  public async deleteTimesheetTasks({
    markings,
    pubsub,
  }: IDeleteMarkingsDTO): Promise<IMarkingResponseDTO[]> {
    const markingsResponse = markings.map(marking => ({
      id: marking.id,
      on_timesheet_status: OnTimesheetStatus.NOT_SENT,
    }))

    await pubsub.publish(CREATED_MARKING, {
      onCreateMarking: markingsResponse,
    })

    return markingsResponse
  }
}
