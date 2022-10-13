import { Project } from '../infra/prisma/entities/Project'
import { IProjectsRepository } from '../repositories/IProjectsRepository'

interface IServiceProps {
  page?: number
  perPage?: number
}

export class ListProjectsService {
  constructor (
    private projectsRepository: IProjectsRepository
  ) {}

  public async execute({ page, perPage }: IServiceProps): Promise<Project[]> {
    const projectsList = await this.projectsRepository.list({ page, perPage })

    return projectsList
  }
}
