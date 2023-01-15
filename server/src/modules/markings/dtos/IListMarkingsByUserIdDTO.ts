import { OnTimesheetStatus } from '@prisma/client'

export interface IListMarkingsByUserIdDTO {
  user_id: string
  on_timesheet_status?: OnTimesheetStatus
  page?: number
  perPage?: number
  search?: string
  date?: string
}
