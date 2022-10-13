import { ICreateProjectDTO } from '../dtos/ICreateProjectDTO'
import { IUpdateProjectDTO } from '../dtos/IUpdateProjectDTO'
import { Project } from '../infra/prisma/entities/Project'

export interface IProjectsRepository {
  findById(id: string): Promise<Project | null>
  findByCode(code: string): Promise<Project | null>
  list(filters: { page?: number, perPage?: number }): Promise<Project[]>
  create(data: ICreateProjectDTO): Promise<Project>
  update(data: IUpdateProjectDTO): Promise<Project>
}
