import { OnTimesheetStatus } from '@prisma/client'

export interface IListMarkingsByUserIdDTO {
  user_id: string
  on_timesheet_status?: OnTimesheetStatus
  page?: number
  perPage?: number
  date?: string
}
