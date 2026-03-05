import { Request, Response } from 'express';
import { GetAllGaragesUseCase } from '../../application/usecases/get-all-garages.usecase';
import { SearchGaragesUseCase } from '../../application/usecases/search-garages.usecase';
import { GetGarageByIdUseCase } from '../../application/usecases/get-garage-by-id.usecase';
import { ApproveGarageUseCase } from '../../application/usecases/approve-garage.usecase';
import { RejectGarageUseCase } from '../../application/usecases/reject-garage.usecase';
import { GarageMapper } from '../../infrastructure/mappers/garage-approval.mapper';

export class GarageApprovalController {
  constructor(
    private readonly getAllUseCase: GetAllGaragesUseCase,
    private readonly searchUseCase: SearchGaragesUseCase,
    private readonly getByIdUseCase: GetGarageByIdUseCase,
    private readonly approveUseCase: ApproveGarageUseCase,
    private readonly rejectUseCase: RejectGarageUseCase,
  ) {}

  getAll = async (_: Request, res: Response) => {
    const garages = await this.getAllUseCase.execute();
    res.json(GarageMapper.toResponseList(garages));
  };

  search = async (req: Request, res: Response) => {
    const q = req.query.q as string;
    const garages = await this.searchUseCase.execute(q);
    res.json(GarageMapper.toResponseList(garages));
  };

  getById = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Invalid id parameter' });
    }

    const garage = await this.getByIdUseCase.execute(id);

    if (!garage) {
      return res.status(404).json({ message: 'Garage not found' });
    }

    res.json(GarageMapper.toResponse(garage));
  };

  approve = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Invalid id parameter' });
    }

    const result = await this.approveUseCase.execute(id);
    res.json(GarageMapper.toResponse(result));
  };

  reject = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Invalid id parameter' });
    }
    const result = await this.rejectUseCase.execute(id);
    res.json(GarageMapper.toResponse(result));
  };
}