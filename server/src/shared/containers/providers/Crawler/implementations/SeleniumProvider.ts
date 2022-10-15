import { ICrawler } from '../models/ICrawler'
import { IDeleteMarkingsDTO } from '../dtos/IDeleteMarkingsDTO';
import { ISaveMarkingsDTO } from '../dtos/ISaveMarkingsDTO';
import { IUpdateMarkingsDTO } from '../dtos/IUpdateMarkingsDTO';
import { IMarkingResponseDTO } from '../dtos/IMarkingResponseDTO';

export class SeleniumProvider implements ICrawler {
  public async saveTimesheetTasks(data: ISaveMarkingsDTO): Promise<IMarkingResponseDTO[]> {
    throw new Error('Method not implemented.');
  }

  public async updateTimesheetTasks(data: IUpdateMarkingsDTO): Promise<IMarkingResponseDTO[]> {
    throw new Error('Method not implemented.');
  }

  public async deleteTimesheetTasks(data: IDeleteMarkingsDTO): Promise<IMarkingResponseDTO[]> {
    throw new Error('Method not implemented.');
  }
}
