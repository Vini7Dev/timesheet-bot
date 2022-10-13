import { inject, injectable } from 'tsyringe'

import { Project } from '../infra/prisma/entities/Project'
import { IProjectsRepository } from '../repositories/IProjectsRepository'

interface IServiceProps {
  page?: number
  perPage?: number
}

@injectable()
export class ListProjectsService {
  constructor (
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository
  ) {}

  public async execute({ page, perPage }: IServiceProps): Promise<Project[]> {
    const projectsList = await this.projectsRepository.list({ page, perPage })

    return projectsList
  }
}
