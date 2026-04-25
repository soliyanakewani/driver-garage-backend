import { CommunityReportListItem, ICommunityReportRepository } from "../../domain/repositories/community-report.repository.interface";

const ALLOWED_STATUSES = new Set(["PENDING", "UNDER_REVIEW", "RESOLVED", "DISMISSED"]);

export class UpdateCommunityReportStatusUseCase {
  constructor(private readonly repository: ICommunityReportRepository) {}

  async execute(id: string, status: string): Promise<CommunityReportListItem> {
    const normalized = status.trim().toUpperCase();
    if (!ALLOWED_STATUSES.has(normalized)) {
      throw new Error(`Invalid status. Allowed: ${Array.from(ALLOWED_STATUSES).join(", ")}`);
    }
    return this.repository.updateStatus(id, normalized);
  }
}
