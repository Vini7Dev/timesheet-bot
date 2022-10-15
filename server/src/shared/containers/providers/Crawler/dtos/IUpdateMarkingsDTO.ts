import { WorkClass } from '@prisma/client'

import { ITimesheetAuthDTO } from './ITimesheetAuthDTO'

export interface IUpdateMarkingsDTO extends ITimesheetAuthDTO {
  markings: IUpdateTimesheetMarkingDTO[]
}

interface IUpdateTimesheetMarkingDTO {
  id: string
  description: string
  date: string
  start_time: string
  finish_time: string
  start_interval_time?: string | null
  finish_interval_time?: string | null
  work_class: WorkClass
  costumer_code: string
  project_code: string
}
