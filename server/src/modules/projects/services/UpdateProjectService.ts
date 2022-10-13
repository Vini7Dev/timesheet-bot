import { ICustomersRepository } from '@modules/customers/repositories/ICustomersRepository';
import { AppError } from '@shared/errors/AppError';
import { Project } from '../infra/prisma/entities/Project';
import { IProjectsRepository } from '../repositories/IProjectsRepository'

interface IServiceProps {
  projectId: string
  code?: string
  name?: string
}

export class UpdateProjectService {
  constructor (
    private projectsRepository: IProjectsRepository,
  ) {}

  public async execute({
    projectId,
    code,
    name,
  }: IServiceProps): Promise<Project> {
    const projectToUpdate = await this.projectsRepository.findById(projectId)

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
      id: projectId,
      code: code ?? projectToUpdate.code,
      name: name ?? projectToUpdate.name,
    }

    const updatedProject = await this.projectsRepository.update(dataToUpdateProject)

    return updatedProject
  }
}
