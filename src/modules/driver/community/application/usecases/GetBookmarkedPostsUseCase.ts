import { PostFeedItem } from "../../domain/types/Post";
import { PostRepository } from "../../domain/repositories/PostRepository";
import { GetBookmarkedPostsDto } from "../dtos/GetBookmarkedPostsDto";

export class GetBookmarkedPostsUseCase {
    constructor(private readonly repository: PostRepository) {}

    async execute(dto: GetBookmarkedPostsDto): Promise<PostFeedItem[]> {
        const page = Number.isFinite(dto.page) && dto.page > 0 ? dto.page : 1;
        const limit = Number.isFinite(dto.limit) && dto.limit > 0 ? Math.min(dto.limit, 50) : 10;
        return this.repository.findBookmarked(dto.viewerId, page, limit);
    }
}
