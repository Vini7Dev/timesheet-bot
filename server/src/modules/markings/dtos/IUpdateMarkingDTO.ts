enum WorkClass {
  PRODUCTION,
  ABSENCE
}

export interface IUpdateMarkingDTO {
  id: string
  description?: string
  date?: string
  start_time?: string
  finish_time?: string
  start_interval_time?: string
  finish_interval_time?: string
  work_class?: WorkClass
  project_id?: string
  user_id?: string
}
