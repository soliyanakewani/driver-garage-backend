import { Request, Response } from "express";
import { PrismaCommunityReportRepository } from "../../infrastructure/repositories/prisma-community-report.repository";
import { ListCommunityReportsUseCase } from "../../application/usecases/list-community-reports.usecase";
import { GetCommunityReportByIdUseCase } from "../../application/usecases/get-community-report-by-id.usecase";
import { UpdateCommunityReportStatusUseCase } from "../../application/usecases/update-community-report-status.usecase";

const repository = new PrismaCommunityReportRepository();
const listUseCase = new ListCommunityReportsUseCase(repository);
const getByIdUseCase = new GetCommunityReportByIdUseCase(repository);
const updateStatusUseCase = new UpdateCommunityReportStatusUseCase(repository);

export class CommunityReportController {
  static async list(req: Request, res: Response) {
    try {
      const statusQuery = req.query.status;
      const status =
        typeof statusQuery === "string" && statusQuery.trim()
          ? statusQuery.trim().toUpperCase()
          : undefined;

      const reports = await listUseCase.execute(status);
      res.json(reports);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const report = await getByIdUseCase.execute(id);
      res.json(report);
    } catch (err: any) {
      const status = err.message === "Report not found" ? 404 : 400;
      res.status(status).json({ error: err.message });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const status = String(req.body.status ?? "");
      const updated = await updateStatusUseCase.execute(id, status);
      res.json(updated);
    } catch (err: any) {
      const statusCode = err.code === "P2025" ? 404 : 400;
      res.status(statusCode).json({ error: err.message });
    }
  }
}
