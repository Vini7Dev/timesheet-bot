export interface IUpdateMarkingsDTO {
  markings: IUpdateTimesheetMarkingDTO[]
}

interface IUpdateTimesheetMarkingDTO {
  id: string
  on_timesheet_id: string
  description: string
  date: string
  start_time: string
  finish_time: string
  start_interval_time?: string | null
  finish_interval_time?: string | null
  is_billable: boolean
}
