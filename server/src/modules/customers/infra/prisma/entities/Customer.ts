import { Project } from '@modules/projects/infra/prisma/entities/Project'

export class Customer {
  id: string

  code: string

  name: string

  projects?: Project[]

  created_at: Date

  updated_at: Date

  deleted_at?: Date | null
}
