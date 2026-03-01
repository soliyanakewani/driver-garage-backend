import { Request, Response } from "express";
import { GetAllEducationContentUseCase } from "../../application/usecases/get-all-education-content.usecase";
import { GetEducationContentByIdUseCase } from "../../application/usecases/get-education-content-by-id.usecase";
import { CreateEducationContentUseCase } from "../../application/usecases/create-education-content.usecase";
import { UpdateEducationContentUseCase } from "../../application/usecases/update-education-content.usecase";
import { DeleteEducationContentUseCase } from "../../application/usecases/delete-education-content.usecase";
import { SearchEducationContentUseCase } from "../../application/usecases/search-education-content.usecase";
import { EducationContentMapper } from "../../infrastructure/mappers/educational-content.mapper";

export class EducationalContentController {
  constructor(
    private readonly getAllUseCase: GetAllEducationContentUseCase,
    private readonly getByIdUseCase: GetEducationContentByIdUseCase,
    private readonly createUseCase: CreateEducationContentUseCase,
    private readonly updateUseCase: UpdateEducationContentUseCase,
    private readonly deleteUseCase: DeleteEducationContentUseCase,
    private readonly searchUseCase: SearchEducationContentUseCase,
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

  create = async (req: Request, res: Response) => {
    const content = await this.createUseCase.execute(req.body);
    res.status(201).json(EducationContentMapper.toResponse(content));
  };

  update = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Invalid id parameter' });
    }

    const content = await this.updateUseCase.execute(id, req.body);
    res.json(EducationContentMapper.toResponse(content));
  };

  delete = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Invalid id parameter' });
    }
    await this.deleteUseCase.execute(id);
    res.status(204).send();
  };

  search = async (req: Request, res: Response) => {
    const contents = await this.searchUseCase.execute(req.query.q as string);
    res.json(EducationContentMapper.toResponseList(contents));
  };
}