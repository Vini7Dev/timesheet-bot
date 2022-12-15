import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';
import { Project } from '../infra/prisma/entities/Project';
import { IProjectsRepository } from '../repositories/IProjectsRepository'

interface IServiceProps {
  project_id: string
}

@injectable()
export class ShowProjectService {
  constructor (
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository
  ) {}

  public async execute({ project_id }: IServiceProps): Promise<Project> {
    const findedProfile = await this.projectsRepository.findById(project_id)

    if (!findedProfile) {
      throw new AppError('Project not found!', 404)
    }

    return findedProfile
  }
}
