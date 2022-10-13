import { ICreateProjectDTO } from '../dtos/ICreateProjectDTO'
import { Project } from '../infra/prisma/entities/Project'

export interface IProjectsRepository {
  findByCode(code: string): Promise<Project | null>
  create(data: ICreateProjectDTO): Promise<Project>
}
