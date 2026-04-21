import { prisma } from "../../../../../infrastructure/prisma/prisma.client";
import {
  CommunityReportListItem,
  ICommunityReportRepository,
} from "../../domain/repositories/community-report.repository.interface";

export class PrismaCommunityReportRepository implements ICommunityReportRepository {
  async listAll(status?: string): Promise<CommunityReportListItem[]> {
    return prisma.postReport.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            content: true,
            imageUrl: true,
            imageUrls: true,
            authorId: true,
            createdAt: true,
          },
        },
        reporter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async getById(id: string): Promise<CommunityReportListItem | null> {
    return prisma.postReport.findUnique({
      where: { id },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            content: true,
            imageUrl: true,
            imageUrls: true,
            authorId: true,
            createdAt: true,
          },
        },
        reporter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async updateStatus(id: string, status: string): Promise<CommunityReportListItem> {
    return prisma.postReport.update({
      where: { id },
      data: { status },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            content: true,
            imageUrl: true,
            imageUrls: true,
            authorId: true,
            createdAt: true,
          },
        },
        reporter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }
}
