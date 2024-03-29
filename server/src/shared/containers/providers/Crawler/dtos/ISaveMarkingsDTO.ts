export interface ISaveMarkingsDTO {
  markings: ISaveTimesheetMarkingDTO[]
}

interface ISaveTimesheetMarkingDTO {
  id: string
  description: string
  date: string
  start_time: string
  finish_time: string
  start_interval_time?: string | null
  finish_interval_time?: string | null
  is_billable: boolean
  custumer_code: string
  project_code: string
}
