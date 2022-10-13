import { AppError } from '@shared/errors/AppError'
import { IProjectsRepository } from '../repositories/IProjectsRepository'

interface IServiceProps {
  projectId: string
}

export class DeleteProjectService {
  constructor (
    private projectsRepository: IProjectsRepository
  ) {}

  public async execute({ projectId }: IServiceProps): Promise<string> {
    const projectToDelete = await this.projectsRepository.findById(projectId)

    if (!projectToDelete) {
      throw new AppError('Project not found!', 404)
    }

    const projectIdDeleted = await this.projectsRepository.delete(projectId)

    return projectIdDeleted
  }
}
