import { CommunityReportListItem, ICommunityReportRepository } from "../../domain/repositories/community-report.repository.interface";

export class ListCommunityReportsUseCase {
  constructor(private readonly repository: ICommunityReportRepository) {}

  async execute(status?: string): Promise<CommunityReportListItem[]> {
    return this.repository.listAll(status);
  }
}
