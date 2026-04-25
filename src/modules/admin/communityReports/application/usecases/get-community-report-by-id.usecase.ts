import { CommunityReportListItem, ICommunityReportRepository } from "../../domain/repositories/community-report.repository.interface";

export class GetCommunityReportByIdUseCase {
  constructor(private readonly repository: ICommunityReportRepository) {}

  async execute(id: string): Promise<CommunityReportListItem> {
    const report = await this.repository.getById(id);
    if (!report) throw new Error("Report not found");
    return report;
  }
}
