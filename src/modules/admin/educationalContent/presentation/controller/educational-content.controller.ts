import { Request, Response } from "express";
import { GetAllEducationContentUseCase } from "../../application/usecases/get-all-education-content.usecase";
import { GetEducationContentByIdUseCase } from "../../application/usecases/get-education-content-by-id.usecase";
import { CreateEducationContentUseCase } from "../../application/usecases/create-education-content.usecase";
import { UpdateEducationContentUseCase } from "../../application/usecases/update-education-content.usecase";
import { DeleteEducationContentUseCase } from "../../application/usecases/delete-education-content.usecase";
import { SearchEducationContentUseCase } from "../../application/usecases/search-education-content.usecase";
import { EducationContentMapper } from "../../infrastructure/mappers/educational-content.mapper";
import { EducationCategory } from "../../domain/entities/educational-content.entity";

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
    try {
      const content = await this.getByIdUseCase.execute(id);
      res.json(EducationContentMapper.toResponse(content));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Not found';
      res.status(404).json({ message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const body = req.body as Record<string, string>;
      const files = req.files as Record<string, Express.Multer.File[]> | undefined;
      const host = `${req.protocol}://${req.get('host')}`;

      let image: string | null =
        typeof body.image === 'string' && body.image.trim() ? body.image.trim() : null;
      let pdf: string | null =
        typeof body.pdfUrl === 'string' && body.pdfUrl.trim() ? body.pdfUrl.trim() : null;

      if (files?.image?.[0]) {
        image = `${host}/uploads/education-images/${files.image[0].filename}`;
      }
      if (files?.pdf?.[0]) {
        pdf = `${host}/uploads/education-manuals/${files.pdf[0].filename}`;
      }

      const content = await this.createUseCase.execute({
        title: body.title,
        description: body.description,
        category: body.category as EducationCategory,
        image,
        pdf,
      });
      res.status(201).json(EducationContentMapper.toResponse(content));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create content';
      res.status(400).json({ message });
    }
  };

  update = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Invalid id parameter' });
    }

    try {
      const existing = await this.getByIdUseCase.execute(id);
      const body = req.body as Record<string, string>;
      const files = req.files as Record<string, Express.Multer.File[]> | undefined;
      const host = `${req.protocol}://${req.get('host')}`;

      const patch: Partial<{
        title: string;
        description: string;
        category: EducationCategory;
        image: string | null;
        pdf: string | null;
      }> = {};

      if (body.title !== undefined) patch.title = body.title;
      if (body.description !== undefined) patch.description = body.description;
      if (body.category !== undefined) patch.category = body.category as EducationCategory;

      if (files?.image?.[0]) {
        patch.image = `${host}/uploads/education-images/${files.image[0].filename}`;
      } else if (body.image !== undefined) {
        patch.image = body.image.trim() || null;
      }

      if (files?.pdf?.[0]) {
        patch.pdf = `${host}/uploads/education-manuals/${files.pdf[0].filename}`;
      } else if (body.pdfUrl !== undefined) {
        patch.pdf = body.pdfUrl.trim() || null;
      }

      const nextCategory = patch.category ?? existing.category;
      const nextPdf = patch.pdf !== undefined ? patch.pdf : existing.pdf ?? null;
      if (nextCategory === EducationCategory.MANUALS && !nextPdf) {
        return res.status(400).json({
          message:
            'MANUALS items must have a PDF (upload field `pdf` or set `pdfUrl`, or keep an existing PDF)',
        });
      }

      const content = await this.updateUseCase.execute(id, patch);
      res.json(EducationContentMapper.toResponse(content));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update';
      const status = message.includes('not found') ? 404 : 400;
      res.status(status).json({ message });
    }
  };

  delete = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Invalid id parameter' });
    }
    try {
      await this.deleteUseCase.execute(id);
      res.status(204).send();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete';
      res.status(400).json({ message });
    }
  };

  search = async (req: Request, res: Response) => {
    const contents = await this.searchUseCase.execute(req.query.q as string);
    res.json(EducationContentMapper.toResponseList(contents));
  };
}
