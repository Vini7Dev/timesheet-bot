import { ICreateProjectDTO } from '@modules/projects/dtos/ICreateProjectDTO'
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
    const findedProject = this.projects.find(project => project.id === id)

    return findedProject ?? null
  }

  public async findByCode(code: string): Promise<Project | null> {
    const findedProject = this.projects.find(project => project.code === code)

    return findedProject ?? null
  }

  public async list({
    page = 0,
    perPage = 10,
  }: { page?: number, perPage?: number }): Promise<Project[]> {
    const filteredProjects = this.projects.slice(page, perPage + page)

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
  }: IUpdateProjectDTO): Promise<Project> {
    const projectToUpdateIndex = this.projects.findIndex(project => project.id === id)

    if(projectToUpdateIndex === -1) {
      throw new AppError('Project not found!', 404)
    }

    const updatedProject = this.projects[projectToUpdateIndex]
    if (code) updatedProject.code = code
    if (name) updatedProject.name = name
    updatedProject.updated_at = (new Date(Date.now() + 10000))

    this.projects[projectToUpdateIndex] = updatedProject

    return updatedProject
  }

  public async delete(id: string): Promise<string> {
    const projectToDeleteIndex = this.projects.findIndex(project => project.id === id)

    if(projectToDeleteIndex !== -1) {
      this.projects.splice(projectToDeleteIndex, 1)
    }

    return id
  }
}
