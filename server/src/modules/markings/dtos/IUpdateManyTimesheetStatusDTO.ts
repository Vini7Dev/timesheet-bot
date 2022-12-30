import { OnTimesheetStatus } from '@prisma/client'

export interface IMarkingTimesheetStatus {
  marking_id: string
  on_timesheet_id?: string | null
  on_timesheet_status: OnTimesheetStatus
  timesheet_error?: string | null
}

export interface IUpdateManyTimesheetStatusDTO {
  markingsStatus: IMarkingTimesheetStatus[]
}

export interface IUpdateManyTimesheetStatusResponse {
  markingsStatus: IMarkingTimesheetStatus[]
}
