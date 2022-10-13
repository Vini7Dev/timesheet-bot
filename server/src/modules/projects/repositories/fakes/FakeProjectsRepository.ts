import { ICreateProjectDTO } from '@modules/projects/dtos/ICreateProjectDTO'
import { Project } from '@modules/projects/infra/prisma/entities/Project'
import { IProjectsRepository } from '../IProjectsRepository'

export class FakeProjectsRepository implements IProjectsRepository {
  private projects: Project[]

  constructor () {
    this.projects = []
  }

  public async findByCode(code: string): Promise<Project | null> {
    const findedProject = this.projects.find(project => project.code === code)

    return findedProject ?? null
  }

  public async create({
    code,
    name,
    customer_id,
  }: ICreateProjectDTO): Promise<Project> {
    const createDate = new Date()

    const createdProject = {
      id: Math.random().toString(),
      code,
      name,
      customer_id,
      created_at: createDate,
      updated_at: createDate,
    }

    this.projects.push(createdProject)

    return createdProject
  }
}
