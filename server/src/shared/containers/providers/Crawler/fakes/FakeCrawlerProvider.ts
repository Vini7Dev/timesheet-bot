import { OnTimesheetStatus } from '@prisma/client'

import { ICrawler } from '../models/ICrawler'
import { IDeleteMarkingsDTO } from '../dtos/IDeleteMarkingsDTO'
import { ICrawlerResponseDTO } from '../dtos/ICrawlerResponseDTO'
import { ISaveMarkingsDTO } from '../dtos/ISaveMarkingsDTO'
import { IUpdateMarkingsDTO } from '../dtos/IUpdateMarkingsDTO'
import { ITimesheetAuthDTO } from '../dtos/ITimesheetAuthDTO'

export class FakeCrawlerProvider implements ICrawler {
  public async authenticateTimesheet(_data: ITimesheetAuthDTO): Promise<void> {
    return
  }

  public async stopCrawler(): Promise<void> {
    return
  }

  public async saveTimesheetTasks({
    markings,
  }: ISaveMarkingsDTO): Promise<ICrawlerResponseDTO> {
    const markingsResponse = markings.map(marking => ({
      id: marking.id,
      on_timesheet_id: marking.id,
      on_timesheet_status: OnTimesheetStatus.SENT,
    }))

    return { markingsResponse }
  }

  public async updateTimesheetTasks({
    markings,
  }: IUpdateMarkingsDTO): Promise<ICrawlerResponseDTO> {
    const markingsResponse = markings.map(marking => ({
      id: marking.id,
      on_timesheet_id: marking.id,
      on_timesheet_status: OnTimesheetStatus.SENT,
    }))

    return { markingsResponse }
  }

  public async deleteTimesheetTasks({
    markings,
  }: IDeleteMarkingsDTO): Promise<ICrawlerResponseDTO> {
    const markingsResponse = markings.map(marking => ({
      id: marking.id,
      on_timesheet_id: marking.id,
      on_timesheet_status: OnTimesheetStatus.NOT_SENT,
    }))

    return { markingsResponse }
  }
}
