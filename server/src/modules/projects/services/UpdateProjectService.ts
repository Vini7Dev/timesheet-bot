import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';
import { Project } from '../infra/prisma/entities/Project';
import { IProjectsRepository } from '../repositories/IProjectsRepository'

interface IServiceProps {
  project_id: string
  code?: string
  name?: string
}

@injectable()
export class UpdateProjectService {
  constructor (
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,
  ) {}

  public async execute({
    project_id,
    code,
    name,
  }: IServiceProps): Promise<Project> {
    const projectToUpdate = await this.projectsRepository.findById(project_id)

    if (!projectToUpdate) {
      throw new AppError('Project not found!', 404)
    }

    if (code) {
      const projectWithSameCode = await this.projectsRepository.findByCode(code)

      if(projectWithSameCode && projectWithSameCode.id !== projectToUpdate.id) {
        throw new AppError('This code already exists!')
      }
    }

    const dataToUpdateProject = {
      id: project_id,
      code: code ?? projectToUpdate.code,
      name: name ?? projectToUpdate.name,
    }

    const updatedProject = await this.projectsRepository.update(dataToUpdateProject)

    return updatedProject
  }
}
