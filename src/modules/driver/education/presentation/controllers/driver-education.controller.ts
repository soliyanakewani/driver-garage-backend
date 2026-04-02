import { Request, Response } from 'express';
import { GetAllEducationContentUseCase } from '../../../../admin/educationalContent/application/usecases/get-all-education-content.usecase';
import { GetEducationContentByIdUseCase } from '../../../../admin/educationalContent/application/usecases/get-education-content-by-id.usecase';
import { SearchEducationContentUseCase } from '../../../../admin/educationalContent/application/usecases/search-education-content.usecase';
import { EducationContentMapper } from '../../../../admin/educationalContent/infrastructure/mappers/educational-content.mapper';

export class DriverEducationController {
  constructor(
    private readonly getAllUseCase: GetAllEducationContentUseCase,
    private readonly getByIdUseCase: GetEducationContentByIdUseCase,
    private readonly searchUseCase: SearchEducationContentUseCase
  ) {}

  getAll = async (_req: Request, res: Response) => {
    const contents = await this.getAllUseCase.execute();
    res.json(EducationContentMapper.toResponseList(contents));
  };

  getById = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Invalid id parameter' });
    }
    const content = await this.getByIdUseCase.execute(id);
    res.json(EducationContentMapper.toResponse(content));
  };

  search = async (req: Request, res: Response) => {
    const query = String(req.query.q ?? '').trim();
    const contents = await this.searchUseCase.execute(query);
    res.json(EducationContentMapper.toResponseList(contents));
  };
}
