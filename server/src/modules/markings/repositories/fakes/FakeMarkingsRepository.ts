import { ICreateMarkingDTO } from '@modules/markings/dtos/ICreateMarkingDTO';
import { Marking } from '@modules/markings/infra/prisma/entities/Marking';
import { IMarkingsRepository } from '../IMarkingsRepository'

export class FakeMarkingsRepository implements IMarkingsRepository {
  public async create(data: ICreateMarkingDTO): Promise<Marking> {
    throw new Error('Method not implemented.');
  }
}
