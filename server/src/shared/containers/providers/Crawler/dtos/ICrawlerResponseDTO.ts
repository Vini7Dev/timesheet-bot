import { OnTimesheetStatus } from '@prisma/client'

export interface IMarkingResponse {
  id: string
  on_timesheet_id?: string
  on_timesheet_status: OnTimesheetStatus
  timesheet_error?: string[]
}

export interface ICrawlerResponseDTO {
  otherError?: string
  markingsResponse: IMarkingResponse[]
}
