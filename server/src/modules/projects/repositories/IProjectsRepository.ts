import { ICreateProjectDTO } from '../dtos/ICreateProjectDTO'
import { Project } from '../infra/prisma/entities/Project'

export interface IProjectsRepository {
  findByCode(code: string): Promise<Project | null>
  list(filters: { page?: number, perPage?: number }): Promise<Project[]>
  create(data: ICreateProjectDTO): Promise<Project>
}
