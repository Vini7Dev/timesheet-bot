import { ICreateProjectDTO } from '@modules/projects/dtos/ICreateProjectDTO'
import { IListProjectsDTO } from '@modules/projects/dtos/IListProjectsDTO'
import { IUpdateProjectDTO } from '@modules/projects/dtos/IUpdateProjectDTO'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectsRepository'
import { AppRepository } from '@shared/infra/prisma/repositories/AppRepository'
import { Project } from '../entities/Project'

export class ProjectsRepository extends AppRepository implements IProjectsRepository {
  public async findById(id: string): Promise<Project | null> {
    const findedProject = await this.client.projects.findFirst({
      where: { id, deleted_at: null },
      include: { customer: true }
    })

    return findedProject
  }

  public async findByCode(code: string): Promise<Project | null> {
    const findedProject = await this.client.projects.findFirst({
      where: { code, deleted_at: null },
      include: { customer: true },
    })

    return findedProject
  }

  public async list({
    page = 0,
    perPage = 10,
    search,
  }: IListProjectsDTO): Promise<Project[]> {
    const projectsList = await this.client.projects.findMany({
      skip: page,
      take: perPage,
      include: { customer: true },
      where: {
        name: { contains: search, mode: 'insensitive' },
        deleted_at: null
      },
      orderBy: { name: 'asc' }
    })

    return projectsList
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

  public async update({
    id,
    code,
    name,
    customer_id,
  }: IUpdateProjectDTO): Promise<Project> {
    const updatedProject = await this.client.projects.update({
      where: { id },
      data: {
        id,
        code,
        name,
        customer_id,
        updated_at: new Date(),
      },
      include: { customer: true },
    })

    return updatedProject
  }

  public async delete(id: string): Promise<string> {
    await this.client.projects.update({
      data: { deleted_at: new Date() },
      where: { id }
    })

    return id
  }
}
