import { ICreateProjectDTO } from '@modules/projects/dtos/ICreateProjectDTO'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectsRepository'
import { AppRepository } from '@shared/infra/prisma/repositories/AppRepository'
import { Project } from '../entities/Project'

export class ProjectsRepository extends AppRepository implements IProjectsRepository {
  public async findByCode(code: string): Promise<Project | null> {
    const findedProject = await this.client.projects.findFirst({
      where: { code },
      include: { customer: true },
    })

    return findedProject
  }

  public async create({
    code,
    name,
    customer_id,
  }: ICreateProjectDTO): Promise<Project> {
    const createdProject = await this.client.projects.create({
      data: {
        code,
        name,
        customer_id,
      },
      include: { customer: true },
    })

    return createdProject
  }
}
