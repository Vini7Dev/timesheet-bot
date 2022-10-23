import { WorkClass } from '@prisma/client'

export interface IDeleteMarkingsDTO {
  markings: IDeleteTimesheetMarkingDTO[]
}

interface IDeleteTimesheetMarkingDTO {
  id: string
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
