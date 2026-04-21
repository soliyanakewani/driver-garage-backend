export interface CommunityReportListItem {
  id: string;
  postId: string;
  reporterId: string;
  reason: string;
  details: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  post: {
    id: string;
    title: string | null;
    content: string;
    imageUrl: string | null;
    imageUrls: string[];
    authorId: string;
    createdAt: Date;
  };
  reporter: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface ICommunityReportRepository {
  listAll(status?: string): Promise<CommunityReportListItem[]>;
  getById(id: string): Promise<CommunityReportListItem | null>;
  updateStatus(id: string, status: string): Promise<CommunityReportListItem>;
}
