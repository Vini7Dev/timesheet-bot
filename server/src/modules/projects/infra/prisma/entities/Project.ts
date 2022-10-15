import { Customer } from '@modules/customers/infra/prisma/entities/Customer'

export class Project {
  id: string

  code: string

  name: string

  customer_id: string | null

  customer?: Customer | null

  created_at: Date

  updated_at: Date
}
