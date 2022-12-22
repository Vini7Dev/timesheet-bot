import { ICreateProjectDTO } from '../dtos/ICreateProjectDTO'
import { IListProjectsDTO } from '../dtos/IListProjectsDTO'
import { IUpdateProjectDTO } from '../dtos/IUpdateProjectDTO'
import { Project } from '../infra/prisma/entities/Project'

export interface IProjectsRepository {
  findById(id: string): Promise<Project | null>
  findByCode(code: string): Promise<Project | null>
  list(filters: IListProjectsDTO): Promise<Project[]>
  create(data: ICreateProjectDTO): Promise<Project>
  update(data: IUpdateProjectDTO): Promise<Project>
  delete(id: string): Promise<string>
}
