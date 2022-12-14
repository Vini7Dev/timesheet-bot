import { ICreateProjectDTO } from '@modules/projects/dtos/ICreateProjectDTO'
import { IListProjectsDTO } from '@modules/projects/dtos/IListProjectsDTO'
import { IUpdateProjectDTO } from '@modules/projects/dtos/IUpdateProjectDTO'
import { Project } from '@modules/projects/infra/prisma/entities/Project'
import { AppError } from '@shared/errors/AppError'
import { IProjectsRepository } from '../IProjectsRepository'

export class FakeProjectsRepository implements IProjectsRepository {
  private projects: Project[]

  constructor () {
    this.projects = []
  }

  public async findById(id: string): Promise<Project | null> {
    const findedProject = this.projects.find(
      project => project.id === id && !project.deleted_at
    )

    return findedProject ?? null
  }

  public async findByCode(code: string): Promise<Project | null> {
    const findedProject = this.projects.find(
      project => project.code === code && !project.deleted_at
    )

    return findedProject ?? null
  }

  public async list({
    page = 0,
    perPage = 10,
    search,
  }: IListProjectsDTO): Promise<Project[]> {
    const filteredProjects = this.projects
      .filter(project => !project.deleted_at)
      .slice(page, perPage + page)

    if (search) {
      return filteredProjects.filter(
        project => project.name
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase())
      )
    }

    return filteredProjects
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

  public async update({
    id,
    code,
    name,
    customer_id,
  }: IUpdateProjectDTO): Promise<Project> {
    const projectToUpdateIndex = this.projects.findIndex(project => project.id === id)

    if(projectToUpdateIndex === -1) {
      throw new AppError('Project not found!', 404)
    }

    const updatedProject = this.projects[projectToUpdateIndex]
    if (code) updatedProject.code = code
    if (name) updatedProject.name = name
    if (customer_id) updatedProject.customer_id = customer_id
    updatedProject.updated_at = (new Date(Date.now() + 10000))

    this.projects[projectToUpdateIndex] = updatedProject

    return updatedProject
  }

  public async delete(id: string): Promise<string> {
    const projectToDeleteIndex = this.projects.findIndex(project => project.id === id)

    if(projectToDeleteIndex !== -1) {
      this.projects[projectToDeleteIndex].deleted_at = new Date()
    }

    return id
  }
}
