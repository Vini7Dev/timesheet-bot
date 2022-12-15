import { inject, injectable } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'
import { IProjectsRepository } from '../repositories/IProjectsRepository'

interface IServiceProps {
  project_id: string
}

@injectable()
export class DeleteProjectService {
  constructor (
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository
  ) {}

  public async execute({ project_id }: IServiceProps): Promise<string> {
    const projectToDelete = await this.projectsRepository.findById(project_id)

    if (!projectToDelete) {
      throw new AppError('Project not found!', 404)
    }

    const projectIdDeleted = await this.projectsRepository.delete(project_id)

    return projectIdDeleted
  }
}
