import { PostRepository } from "../../domain/repositories/PostRepository";
import { GetPostsDto } from "../dtos/GetPostsDto";
import { PostFeedItem } from "../../domain/types/Post";

export class GetPostsUseCase {
    constructor(private repo: PostRepository) {}

    async execute(dto: GetPostsDto): Promise<PostFeedItem[]> {
        const page = Number.isFinite(dto.page) && dto.page > 0 ? dto.page : 1;
        const limit = Number.isFinite(dto.limit) && dto.limit > 0 ? Math.min(dto.limit, 50) : 10;
        const filter = dto.filter ?? "all";
        const q = dto.q?.trim() || undefined;
        return this.repo.findAll(page, limit, dto.viewerId, { q, filter });
    }
}
