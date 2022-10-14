import { Project } from '@modules/projects/infra/prisma/entities/Project'
import { User } from '@modules/users/infra/prisma/entities/User'

enum WorkClass {
  PRODUCTION,
  ABSENCE
}

export class Marking {
  id: string

  description: string

  date: string

  start_time: string

  finish_time: string

  start_interval_time?: string

  finish_interval_time?: string

  work_class: WorkClass

  user_id: string

  user?: User

  project_id: string

  project?: Project

  created_at: Date

  updated_at: Date
}
