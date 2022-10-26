import { WorkClass } from '@prisma/client'

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
  work_class: WorkClass
  custumer_code: string
  project_code: string
}
