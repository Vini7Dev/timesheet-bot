import { OnTimesheetStatus } from '@prisma/client'

export interface IMarkingResponseDTO {
  id: string
  on_timesheet_status: OnTimesheetStatus
  timesheet_error?: string
}
