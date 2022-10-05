import { PrismaClient } from '@prisma/client'

export class AppRepository {
  protected client: PrismaClient

  constructor() {
    this.client = new PrismaClient()
  }
}
