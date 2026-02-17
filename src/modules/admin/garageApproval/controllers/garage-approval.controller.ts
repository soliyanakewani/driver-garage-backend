import { Request, Response } from 'express';
import { GarageApprovalService } from '../services/garage-approval.service';

const service = new GarageApprovalService();

export const getAllGarages = async (_: Request, res: Response) => {
  try {
    const garages = await service.getAllGarages();
    res.json(garages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getGarageById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const garage = await service.getGarageById(id);
    if (!garage) return res.status(404).json({ error: 'Garage not found' });
    res.json(garage);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const searchGarages = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    const garages = await service.searchGarages(query);
    res.json(garages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  };
};

export const approveGarage = async (req: Request, res: Response) => {
  try {
    const  id  = req.params.id as string;
    const result = await service.approveGarage(id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const rejectGarage = async (req: Request, res: Response) => {
  try {
    const  id  = req.params.id as string;
    const result = await service.rejectGarage(id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
