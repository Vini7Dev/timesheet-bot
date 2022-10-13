import { IProjectsRepository } from '../repositories/IProjectsRepository'

interface IServiceProps {
  code: string
  name: string
  customer_id: string
}

export class CreateProjectService {
  constructor (
    private projectsRepository: IProjectsRepository,
  ) {}

  public async execute(data: IServiceProps) {
    throw new Error('Method not implemented.')
  }
}
