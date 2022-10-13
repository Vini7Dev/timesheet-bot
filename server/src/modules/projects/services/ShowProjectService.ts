import { AppError } from '@shared/errors/AppError';
import { Project } from '../infra/prisma/entities/Project';
import { IProjectsRepository } from '../repositories/IProjectsRepository'

interface IServiceProps {
  projectId: string
}

export class ShowProjectService {
  constructor (
    private projectsRepository: IProjectsRepository
  ) {}

  public async execute({ projectId }: IServiceProps): Promise<Project> {
    const findedProfile = await this.projectsRepository.findById(projectId)

    if (!findedProfile) {
      throw new AppError('Project not found!', 404)
    }

    return findedProfile
  }
}
