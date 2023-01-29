import { OnTimesheetStatus } from '@prisma/client'

import { Project } from '@modules/projects/infra/prisma/entities/Project'
import { User } from '@modules/users/infra/prisma/entities/User'

export class Marking {
  id: string

  on_timesheet_id?: string | null

  on_timesheet_status: OnTimesheetStatus

  timesheet_error?: string | null

  description: string

  date: string

  start_time: string

  finish_time: string

  start_interval_time?: string | null

  finish_interval_time?: string | null

  is_billable: boolean

  user_id: string | null

  user?: User | null

  project_id: string | null

  project?: Project | null

  created_at: Date

  updated_at: Date

  deleted_at?: Date | null
}
