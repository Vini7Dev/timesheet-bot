import { WorkClass, Projects, Users } from '@prisma/client'

export class Marking {
  id: string

  description: string

  date: string

  start_time: string

  finish_time: string

  start_interval_time?: string | null

  finish_interval_time?: string | null

  work_class: WorkClass

  user_id: string | null

  user?: Users | null

  project_id: string | null

  project?: Projects | null

  created_at: Date

  updated_at: Date
}
