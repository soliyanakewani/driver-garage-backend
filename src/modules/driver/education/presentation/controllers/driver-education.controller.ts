import { Request, Response } from 'express';
import { GetAllEducationContentUseCase } from '../../../../admin/educationalContent/application/usecases/get-all-education-content.usecase';
import { GetEducationContentByIdUseCase } from '../../../../admin/educationalContent/application/usecases/get-education-content-by-id.usecase';
import { SearchEducationContentUseCase } from '../../../../admin/educationalContent/application/usecases/search-education-content.usecase';
import { EducationContentMapper } from '../../../../admin/educationalContent/infrastructure/mappers/educational-content.mapper';
import { EducationCategory } from '../../../../admin/educationalContent/domain/entities/educational-content.entity';

export class DriverEducationController {
  constructor(
    private readonly getAllUseCase: GetAllEducationContentUseCase,
    private readonly getByIdUseCase: GetEducationContentByIdUseCase,
    private readonly searchUseCase: SearchEducationContentUseCase
  ) {}

  getAll = async (req: Request, res: Response) => {
    const raw = req.query.category;
    const cat =
      typeof raw === 'string' && Object.values(EducationCategory).includes(raw as EducationCategory)
        ? (raw as EducationCategory)
        : undefined;
    const contents = await this.getAllUseCase.execute(cat);
    res.json(EducationContentMapper.toResponseList(contents));
  };

  getById = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Invalid id parameter' });
    }
    try {
      const content = await this.getByIdUseCase.execute(id);
      res.json(EducationContentMapper.toResponse(content));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Not found';
      res.status(404).json({ message });
    }
  };

  search = async (req: Request, res: Response) => {
    const query = String(req.query.q ?? '').trim();
    const contents = await this.searchUseCase.execute(query);
    res.json(EducationContentMapper.toResponseList(contents));
  };
}
