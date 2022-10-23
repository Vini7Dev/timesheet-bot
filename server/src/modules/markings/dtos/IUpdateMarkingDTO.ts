import { WorkClass } from '@prisma/client'

export interface IUpdateMarkingDTO {
  id: string
  description?: string
  date?: string
  start_time?: string
  finish_time?: string
  start_interval_time?: string
  finish_interval_time?: string
  work_class?: WorkClass
  user_id?: string
}
